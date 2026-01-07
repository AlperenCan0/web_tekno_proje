import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Users Service - Kullanıcı işlemlerini yönetir
 * CRUD operasyonları ve kullanıcı sorgulama işlemlerini gerçekleştirir
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  /**
   * Yeni kullanıcı oluşturur
   * Profil bilgileri ile birlikte oluşturulur
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, ...userData } = createUserDto;

    const user = this.usersRepository.create(userData);
    const savedUser = await this.usersRepository.save(user);

    // Profil oluştur
    const profile = this.profilesRepository.create({
      firstName,
      lastName,
      userId: savedUser.id,
    });
    await this.profilesRepository.save(profile);

    return this.findOne(savedUser.id);
  }

  /**
   * Tüm kullanıcıları getirir (profil bilgileri ile)
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['profile'],
    });
  }

  /**
   * ID'ye göre kullanıcı getirir
   */
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

  /**
   * E-posta adresine göre kullanıcı getirir
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['profile'],
    });
  }

  /**
   * Kullanıcı adına göre kullanıcı getirir
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['profile'],
    });
  }

  /**
   * Kullanıcı bilgilerini günceller
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      const bcrypt = require('bcrypt');
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.usersRepository.update(id, updateUserDto);

    // Profil bilgilerini güncelle
    if (updateUserDto.firstName || updateUserDto.lastName) {
      const profile = await this.profilesRepository.findOne({
        where: { userId: id },
      });

      if (profile) {
        await this.profilesRepository.update(profile.id, {
          firstName: updateUserDto.firstName,
          lastName: updateUserDto.lastName,
        });
      }
    }

    return this.findOne(id);
  }

  /**
   * Kullanıcıyı siler
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}

