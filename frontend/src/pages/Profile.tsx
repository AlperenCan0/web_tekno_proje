import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storiesApi, usersApi, uploadApi } from '../services/api';
import { getPhotoUrl } from '../config';
import { Story, Comment } from '../types';
import { Container } from '../components/layout';
import { Card, CardBody, Button, Spinner } from '../components/ui';
import { Link } from 'react-router-dom';
import {
    Camera,
    User,
    Settings,
    MessageCircle,
    Heart,
    BookOpen,
    Lock,
    Mail,
    Calendar,
    ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

type TabType = 'settings' | 'interactions';
type SettingsSubTab = 'profile' | 'password';
type InteractionsSubTab = 'favorites' | 'comments';

/**
 * Profile Page Component - Kullanıcı profil sayfası
 * Ayarlar ve Etkileşimler sekmeleri içerir
 */
const Profile: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('settings');
    const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>('profile');
    const [interactionsSubTab, setInteractionsSubTab] = useState<InteractionsSubTab>('favorites');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState('');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const [myStories, setMyStories] = useState<Story[]>([]);
    const [myComments, setMyComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
            setAvatar(user.profile?.avatar || '');
        }
    }, [user]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingAvatar(true);
            try {
                const { url } = await uploadApi.uploadPhoto(file);
                setAvatar(url);
                toast.success('Fotoğraf yüklendi, kaydetmeyi unutmayın');
            } catch (error) {
                toast.error('Fotoğraf yüklenirken bir hata oluştu');
            } finally {
                setUploadingAvatar(false);
            }
        }
    };

    useEffect(() => {
        if (activeTab === 'interactions') {
            loadInteractionsData();
        }
    }, [activeTab, interactionsSubTab]);

    const loadInteractionsData = async () => {
        setIsLoading(true);
        try {
            if (interactionsSubTab === 'favorites') {
                const stories = await storiesApi.getMyStories();
                setMyStories(stories);
            } else if (interactionsSubTab === 'comments') {
                const stories = await storiesApi.getMyStories();
                setMyStories(stories);
                const allComments: Comment[] = [];
                stories.forEach(story => {
                    if (story.comments) {
                        story.comments.forEach(comment => {
                            allComments.push({ ...comment, story } as any);
                        });
                    }
                });
                setMyComments(allComments);
            }
        } catch (error) {
            toast.error('Veriler yüklenirken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (!user?.id) return;

            await usersApi.update(user.id, {
                username,
                firstName: user.profile?.firstName,
                lastName: user.profile?.lastName,
                avatar
            });

            toast.success('Profil bilgileri güncellendi, lütfen sayfayı yenileyin');
        } catch (error) {
            toast.error('Profil güncellenirken bir hata oluştu');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Yeni şifreler eşleşmiyor');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Şifre en az 6 karakter olmalıdır');
            return;
        }

        setIsSaving(true);
        try {
            toast.success('Şifre başarıyla değiştirildi');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error('Şifre değiştirilirken bir hata oluştu');
        } finally {
            setIsSaving(false);
        }
    };

    const renderSettingsContent = () => {
        if (settingsSubTab === 'profile') {
            return (
                <Card>
                    <CardBody>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-amber-600" />
                            Profil Bilgileri
                        </h3>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                    {avatar ? (
                                        <img
                                            src={getPhotoUrl(avatar)}
                                            alt="Profil"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-amber-100 text-amber-600">
                                            <User className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="cursor-pointer bg-white border border-gray-300 rounded-md py-2 px-4 inline-flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                                        <Camera className="w-4 h-4 mr-2" />
                                        {uploadingAvatar ? 'Yükleniyor...' : 'Fotoğraf Değiştir'}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            disabled={uploadingAvatar}
                                        />
                                    </label>
                                    <p className="mt-1 text-xs text-gray-500">
                                        JPG, GIF veya PNG. Maks 5MB.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kullanıcı Adı
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="Kullanıcı adınız"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    E-posta
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="E-posta adresiniz"
                                />
                            </div>
                            <div className="pt-4">
                                <Button type="submit" isLoading={isSaving}>
                                    Değişiklikleri Kaydet
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            );
        }

        return (
            <Card>
                <CardBody>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-amber-600" />
                        Şifre Değiştir
                    </h3>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mevcut Şifre
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Mevcut şifreniz"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Yeni Şifre
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Yeni şifreniz"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Yeni Şifre (Tekrar)
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Yeni şifrenizi tekrar girin"
                                required
                            />
                        </div>
                        <div className="pt-4">
                            <Button type="submit" isLoading={isSaving}>
                                Şifreyi Değiştir
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        );
    };

    const renderInteractionsContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center py-12">
                    <Spinner size="lg" text="Yükleniyor..." />
                </div>
            );
        }

        if (interactionsSubTab === 'favorites') {
            return (
                <Card>
                    <CardBody>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            Hikayelerim
                        </h3>
                        {myStories.length > 0 ? (
                            <div className="space-y-4">
                                {myStories.map((story) => (
                                    <Link
                                        key={story.id}
                                        to={`/stories/${story.id}`}
                                        className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{story.title}</h4>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {story.content.substring(0, 100)}...
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Heart className="w-4 h-4" />
                                                {story.likes}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Henüz hikayeniz yok</p>
                                <Link to="/create-story" className="text-amber-600 hover:underline mt-2 inline-block">
                                    İlk hikayenizi oluşturun
                                </Link>
                            </div>
                        )}
                    </CardBody>
                </Card>
            );
        }

        return (
            <Card>
                <CardBody>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-amber-600" />
                        Hikayelerime Gelen Yorumlar
                    </h3>
                    {myComments.length > 0 ? (
                        <div className="space-y-4">
                            {myComments.map((comment, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-amber-600" />
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900">
                                                    {comment.author?.username || 'Anonim'}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-2">
                                                    {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-2">{comment.content}</p>
                                    <Link
                                        to={`/stories/${(comment as any).story?.id}`}
                                        className="text-sm text-amber-600 hover:underline flex items-center gap-1"
                                    >
                                        <BookOpen className="w-3 h-3" />
                                        {(comment as any).story?.title}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Henüz hikayelerinize yorum yapılmamış</p>
                        </div>
                    )}
                </CardBody>
            </Card>
        );
    };

    return (
        <Container className="py-8 md:py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                        {avatar ? (
                            <img
                                src={getPhotoUrl(avatar)}
                                alt={user?.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-10 h-10 text-white" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
                        <p className="text-gray-600 flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4" />
                            {user?.email}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4" />
                            {user?.role} olarak kayıtlı
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1"
                >
                    <Card>
                        <CardBody className="p-0">
                            {/* Ana Sekmeler */}
                            <div className="border-b border-gray-200">
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full px-4 py-3 text-left flex items-center justify-between ${activeTab === 'settings'
                                        ? 'bg-amber-50 text-amber-600 border-l-4 border-amber-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Settings className="w-5 h-5" />
                                        Ayarlar
                                    </span>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'settings' ? 'rotate-90' : ''}`} />
                                </button>
                                {activeTab === 'settings' && (
                                    <div className="bg-gray-50 border-l-4 border-amber-600">
                                        <button
                                            onClick={() => setSettingsSubTab('profile')}
                                            className={`w-full px-8 py-2 text-left text-sm ${settingsSubTab === 'profile'
                                                ? 'text-amber-600 font-medium'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            Profil Bilgileri
                                        </button>
                                        <button
                                            onClick={() => setSettingsSubTab('password')}
                                            className={`w-full px-8 py-2 text-left text-sm ${settingsSubTab === 'password'
                                                ? 'text-amber-600 font-medium'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            Şifre Değiştir
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <button
                                    onClick={() => setActiveTab('interactions')}
                                    className={`w-full px-4 py-3 text-left flex items-center justify-between ${activeTab === 'interactions'
                                        ? 'bg-amber-50 text-amber-600 border-l-4 border-amber-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Heart className="w-5 h-5" />
                                        Etkileşimler
                                    </span>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'interactions' ? 'rotate-90' : ''}`} />
                                </button>
                                {activeTab === 'interactions' && (
                                    <div className="bg-gray-50 border-l-4 border-amber-600">
                                        <button
                                            onClick={() => setInteractionsSubTab('favorites')}
                                            className={`w-full px-8 py-2 text-left text-sm ${interactionsSubTab === 'favorites'
                                                ? 'text-amber-600 font-medium'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            Hikayelerim
                                        </button>
                                        <button
                                            onClick={() => setInteractionsSubTab('comments')}
                                            className={`w-full px-8 py-2 text-left text-sm ${interactionsSubTab === 'comments'
                                                ? 'text-amber-600 font-medium'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            Gelen Yorumlar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </motion.div>

                {/* Content Area */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3"
                >
                    {activeTab === 'settings' ? renderSettingsContent() : renderInteractionsContent()}
                </motion.div>
            </div>
        </Container>
    );
};

export default Profile;
