import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, avatar, ...userData } = createUserDto;

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const user = this.usersRepository.create(userData);
    const savedUser = await this.usersRepository.save(user);

    const profile = this.profilesRepository.create({
      firstName,
      lastName,
      avatar,
      userId: savedUser.id,
    });
    await this.profilesRepository.save(profile);

    return this.findOne(savedUser.id);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['profile'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile', 'stories', 'comments'],
    });

    if (!user) {
      throw new NotFoundException(`ID ${id} ile kullanıcı bulunamadı`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['profile'],
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['profile'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    const { firstName, lastName, avatar, ...userData } = updateUserDto;

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    if (Object.keys(userData).length > 0) {
      await this.usersRepository.update(id, userData);
    }

    if (firstName !== undefined || lastName !== undefined || avatar !== undefined) {
      const profile = await this.profilesRepository.findOne({
        where: { userId: id },
      });

      if (profile) {
        const profileUpdateData: any = {};
        if (firstName !== undefined) profileUpdateData.firstName = firstName;
        if (lastName !== undefined) profileUpdateData.lastName = lastName;
        if (avatar !== undefined) profileUpdateData.avatar = avatar;

        if (Object.keys(profileUpdateData).length > 0) {
          await this.profilesRepository.update(profile.id, profileUpdateData);
        }
      }
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
