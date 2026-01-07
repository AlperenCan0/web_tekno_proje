import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { Story } from '../entities/story.entity';
import { Category } from '../entities/category.entity';
import { Comment } from '../entities/comment.entity';
import * as bcrypt from 'bcrypt';

/**
 * Seed Service - Veritabanına örnek veriler yükler
 * Kullanıcılar, kategoriler, hikayeler ve yorumlar oluşturur
 */
@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async seed() {
    console.log('🌱 Seed işlemi başlıyor...');

    // Mevcut verileri temizle
    await this.cleanDatabase();

    // Kategorileri oluştur
    const categories = await this.createCategories();

    // Kullanıcıları oluştur
    const users = await this.createUsers();

    // Hikayeleri oluştur
    const stories = await this.createStories(users, categories);

    // Yorumları oluştur
    await this.createComments(users, stories);

    console.log('✅ Seed işlemi tamamlandı!');
  }

  private async cleanDatabase() {
    console.log('🧹 Mevcut veriler temizleniyor...');
    await this.commentsRepository.delete({});
    await this.storiesRepository.delete({});
    await this.profilesRepository.delete({});
    await this.usersRepository.delete({});
    await this.categoriesRepository.delete({});
  }

  private async createCategories(): Promise<Category[]> {
    console.log('📁 Kategoriler oluşturuluyor...');
    const categoriesData = [
      { name: 'Tarihi Yerler', description: 'Tarihi mekanlar ve yerler' },
      { name: 'Doğa', description: 'Doğal güzellikler ve manzaralar' },
      { name: 'Kültür', description: 'Kültürel etkinlikler ve gelenekler' },
      { name: 'Yemek', description: 'Yerel lezzetler ve restoranlar' },
      { name: 'Eğlence', description: 'Eğlence mekanları ve aktiviteler' },
    ];

    const categories = [];
    for (const catData of categoriesData) {
      const category = this.categoriesRepository.create(catData);
      const saved = await this.categoriesRepository.save(category);
      categories.push(saved);
    }

    return categories;
  }

  private async createUsers(): Promise<User[]> {
    console.log('👥 Kullanıcılar oluşturuluyor...');
    const usersData = [
      {
        email: 'admin@example.com',
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        role: 'Admin' as const,
        firstName: 'Admin',
        lastName: 'User',
      },
      {
        email: 'superadmin@example.com',
        username: 'superadmin',
        password: await bcrypt.hash('superadmin123', 10),
        role: 'SuperAdmin' as const,
        firstName: 'Super',
        lastName: 'Admin',
      },
      {
        email: 'user1@example.com',
        username: 'hikayecim',
        password: await bcrypt.hash('user123', 10),
        role: 'User' as const,
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
      },
      {
        email: 'user2@example.com',
        username: 'yerelgezgin',
        password: await bcrypt.hash('user123', 10),
        role: 'User' as const,
        firstName: 'Ayşe',
        lastName: 'Demir',
      },
    ];

    const users = [];
    for (const userData of usersData) {
      const { firstName, lastName, ...userFields } = userData;
      const user = this.usersRepository.create(userFields);
      const savedUser = await this.usersRepository.save(user);

      // Profil oluştur
      const profile = this.profilesRepository.create({
        firstName,
        lastName,
        bio: `${firstName} ${lastName} - Yerel hikaye paylaşımcısı`,
        location: 'İstanbul, Türkiye',
        userId: savedUser.id,
      });
      await this.profilesRepository.save(profile);

      users.push(savedUser);
    }

    return users;
  }

  private async createStories(users: User[], categories: Category[]): Promise<Story[]> {
    console.log('📖 Hikayeler oluşturuluyor...');
    const storiesData = [
      {
        title: 'İstanbul Boğazı\'nın Büyüleyici Manzarası',
        content: `İstanbul Boğazı, şehrin en büyüleyici doğal güzelliklerinden biridir. 
Sabahın erken saatlerinde, güneşin ilk ışıkları suyun üzerine düştüğünde, 
boğazın her iki yakasındaki tarihi yapılar altın rengine bürünür. 
Bu manzara, yüzyıllardır şairlere, ressamlara ve gezginlere ilham kaynağı olmuştur.
Boğazda vapurla seyahat etmek, İstanbul'un en keyifli deneyimlerinden biridir.`,
        latitude: 41.0082,
        longitude: 28.9784,
        locationName: 'İstanbul, Boğaz',
        author: users[2],
        categories: [categories[0], categories[1]],
        isPublished: true,
        likes: 15,
        dislikes: 2,
      },
      {
        title: 'Kapadokya\'nın Peri Bacaları',
        content: `Kapadokya, Türkiye'nin en eşsiz doğal oluşumlarından birine ev sahipliği yapar: Peri Bacaları.
Bu muhteşem yapılar, milyonlarca yıl önce volkanik patlamalar sonucu oluşmuş ve zamanla rüzgar ve suyun 
aşındırmasıyla bugünkü şekillerini almıştır. Sabahın erken saatlerinde sıcak hava balonuyla 
Kapadokya'yı görmek, hayatınızın en unutulmaz deneyimlerinden biri olacaktır.`,
        latitude: 38.6431,
        longitude: 34.8331,
        locationName: 'Kapadokya, Nevşehir',
        author: users[3],
        categories: [categories[1], categories[2]],
        isPublished: true,
        likes: 23,
        dislikes: 1,
      },
      {
        title: 'Antalya\'nın Tarihi Kaleiçi Bölgesi',
        content: `Antalya'nın kalbi olan Kaleiçi, Osmanlı ve Selçuklu mimarisinin en güzel örneklerini barındırır.
Daracık sokaklar, tarihi evler ve antik surlar, ziyaretçileri geçmişe götürür.
Akşam saatlerinde bölgedeki restoranlarda yerel lezzetleri tatmak ve limana bakan teraslarda 
çay içmek, Antalya deneyiminin vazgeçilmez parçalarıdır.`,
        latitude: 36.8841,
        longitude: 30.7056,
        locationName: 'Antalya, Kaleiçi',
        author: users[2],
        categories: [categories[0], categories[3]],
        isPublished: true,
        likes: 18,
        dislikes: 3,
      },
      {
        title: 'Bursa\'nın Tarihi Çarşısı',
        content: `Bursa'nın ünlü çarşısı, Osmanlı döneminden kalma geleneksel ticaret kültürünün 
canlı bir örneğidir. Burada ipek kumaşlardan baharatlara, el yapımı eşyalardan 
geleneksel tatlılara kadar her şeyi bulabilirsiniz. Çarşıdaki esnaflar, yüzyıllardır 
süren gelenekleri yaşatmaya devam ediyor.`,
        latitude: 40.1826,
        longitude: 29.0665,
        locationName: 'Bursa, Tarihi Çarşı',
        author: users[3],
        categories: [categories[2], categories[3]],
        isPublished: true,
        likes: 12,
        dislikes: 0,
      },
      {
        title: 'Pamukkale\'nin Beyaz Travertenleri',
        content: `Pamukkale, dünyanın en eşsiz doğal oluşumlarından biridir. Kalsiyum karbonatlı 
suların oluşturduğu beyaz travertenler, adeta pamuktan bir kale gibi görünür.
Burada hem doğal güzellikleri keşfedebilir, hem de antik Hierapolis şehrinin kalıntılarını 
ziyaret edebilirsiniz. Travertenlerde yürümek ve termal sularında yüzmek, 
Pamukkale deneyiminin vazgeçilmez parçalarıdır.`,
        latitude: 37.9200,
        longitude: 29.1200,
        locationName: 'Pamukkale, Denizli',
        author: users[2],
        categories: [categories[1], categories[0]],
        isPublished: true,
        likes: 31,
        dislikes: 1,
      },
    ];

    const stories = [];
    for (const storyData of storiesData) {
      const story = this.storiesRepository.create(storyData);
      const saved = await this.storiesRepository.save(story);
      stories.push(saved);
    }

    return stories;
  }

  private async createComments(users: User[], stories: Story[]) {
    console.log('💬 Yorumlar oluşturuluyor...');
    const commentsData = [
      {
        content: 'Harika bir hikaye! İstanbul Boğazı gerçekten büyüleyici.',
        author: users[3],
        story: stories[0],
        likes: 5,
        dislikes: 0,
      },
      {
        content: 'Kapadokya\'yı görmek benim de hayalim. Çok güzel anlatmışsınız!',
        author: users[2],
        story: stories[1],
        likes: 3,
        dislikes: 0,
      },
      {
        content: 'Antalya Kaleiçi gerçekten çok güzel bir yer. Herkesin görmesi gerekiyor.',
        author: users[3],
        story: stories[2],
        likes: 4,
        dislikes: 1,
      },
      {
        content: 'Pamukkale muhteşem! Fotoğraflar bile yeterince güzel değil.',
        author: users[2],
        story: stories[4],
        likes: 7,
        dislikes: 0,
      },
    ];

    for (const commentData of commentsData) {
      const comment = this.commentsRepository.create(commentData);
      await this.commentsRepository.save(comment);
    }
  }
}

