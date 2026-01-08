import { useState, useEffect } from 'react';
import { usersApi, categoriesApi, storiesApi } from '../services/api';
import { User, Category, Story } from '../types';
import { useApiCall } from '../hooks/useApiCall';
import { useDeleteConfirmation } from '../hooks/useDeleteConfirmation';
import { MESSAGES } from '../constants/messages';
import { Modal, Button, Input } from '../components/ui';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useFormValidation, validationRules } from '../hooks/useFormValidation';
import { useAuth } from '../contexts/AuthContext';

/**
 * Admin Panel Component - Yönetim paneli
 * Sadece Admin ve SuperAdmin kullanıcılar erişebilir
 * Kullanıcı, kategori ve hikaye yönetimi yapılabilir
 */
const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'categories' | 'stories'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const { execute: executeApiCall, isLoading } = useApiCall();
  const { confirmDelete } = useDeleteConfirmation();

  // Modal states
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [viewUserModalOpen, setViewUserModalOpen] = useState(false);
  const [viewStoryModalOpen, setViewStoryModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    await executeApiCall(
      async () => {
        switch (activeTab) {
          case 'users':
            const usersData = await usersApi.getAll();
            setUsers(usersData);
            break;
          case 'categories':
            const categoriesData = await categoriesApi.getAll();
            setCategories(categoriesData);
            break;
          case 'stories':
            const storiesData = await storiesApi.getAll(false);
            setStories(storiesData);
            break;
        }
      },
      {
        errorMessage: MESSAGES.ERROR.DATA_LOAD_FAILED,
        showToast: false,
      },
    );
  };

  // User CRUD
  const handleCreateUser = () => {
    setEditingUser(null);
    setUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserModalOpen(true);
  };

  const handleViewUser = async (user: User) => {
    await executeApiCall(
      async () => {
        const fullUser = await usersApi.getById(user.id);
        setViewingUser(fullUser);
        setViewUserModalOpen(true);
        return fullUser;
      },
      {
        errorMessage: 'Kullanıcı bilgileri yüklenirken bir hata oluştu',
        showToast: false,
      },
    );
  };

  const handleDeleteUser = async (id: string) => {
    confirmDelete(async () => {
      await executeApiCall(
        () => usersApi.delete(id),
        {
          successMessage: MESSAGES.SUCCESS.USER_DELETED,
          errorMessage: MESSAGES.ERROR.USER_DELETE_FAILED,
          onSuccess: () => {
            loadData();
          },
        },
      );
    });
  };

  // Category CRUD
  const handleCreateCategory = () => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    confirmDelete(async () => {
      await executeApiCall(
        () => categoriesApi.delete(id),
        {
          successMessage: MESSAGES.SUCCESS.CATEGORY_DELETED,
          errorMessage: MESSAGES.ERROR.CATEGORY_DELETE_FAILED,
          onSuccess: () => {
            loadData();
          },
        },
      );
    });
  };

  // Story CRUD
  const handleCreateStory = () => {
    setEditingStory(null);
    setStoryModalOpen(true);
  };

  const handleEditStory = (story: Story) => {
    setEditingStory(story);
    setStoryModalOpen(true);
  };

  const handleViewStory = async (story: Story) => {
    await executeApiCall(
      async () => {
        const fullStory = await storiesApi.getById(story.id);
        setViewingStory(fullStory);
        setViewStoryModalOpen(true);
        return fullStory;
      },
      {
        errorMessage: 'Hikaye bilgileri yüklenirken bir hata oluştu',
        showToast: false,
      },
    );
  };

  const handleDeleteStory = async (id: string) => {
    confirmDelete(async () => {
      await executeApiCall(
        () => storiesApi.delete(id),
        {
          successMessage: MESSAGES.SUCCESS.STORY_DELETED,
          errorMessage: MESSAGES.ERROR.STORY_DELETE_FAILED,
          onSuccess: () => {
            loadData();
          },
        },
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Yönetim Paneli</h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'users'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Kullanıcılar
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'categories'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Kategoriler
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'stories'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Hikayeler
          </button>
        </nav>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12">Yükleniyor...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Kullanıcılar ({users.length})</h2>
                <Button onClick={handleCreateUser} variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Kullanıcı
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kullanıcı Adı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        E-posta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'SuperAdmin' ? 'bg-orange-100 text-orange-800' :
                            user.role === 'Admin' ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {user.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Görüntüle"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-amber-600 hover:text-amber-900"
                              title="Düzenle"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Kategoriler ({categories.length})</h2>
                <Button onClick={handleCreateCategory} variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Kategori
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-amber-600 hover:text-amber-900"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-2">{category.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stories' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Tüm Hikayeler ({stories.length})</h2>
                <Button onClick={handleCreateStory} variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Hikaye
                </Button>
              </div>
              <div className="space-y-4">
                {stories.map((story) => (
                  <div key={story.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{story.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Yazar: {story.author?.username || 'Bilinmiyor'} |
                          {story.isPublished ? ' ✅ Yayında' : ' ⏸️ Taslak'} |
                          {new Date(story.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {story.content}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleViewStory(story)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditStory(story)}
                          className="text-amber-600 hover:text-amber-900"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSuccess={loadData}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSuccess={loadData}
      />

      {/* Story Modal */}
      <StoryModal
        isOpen={storyModalOpen}
        onClose={() => {
          setStoryModalOpen(false);
          setEditingStory(null);
        }}
        story={editingStory}
        onSuccess={loadData}
      />

      {/* View User Modal */}
      <ViewUserModal
        isOpen={viewUserModalOpen}
        onClose={() => {
          setViewUserModalOpen(false);
          setViewingUser(null);
        }}
        user={viewingUser}
      />

      {/* View Story Modal */}
      <ViewStoryModal
        isOpen={viewStoryModalOpen}
        onClose={() => {
          setViewStoryModalOpen(false);
          setViewingStory(null);
        }}
        story={viewingStory}
      />
    </div>
  );
};

// User Modal Component
interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, onSuccess }) => {
  const { execute, isLoading } = useApiCall();
  const { user: currentUser } = useAuth();
  const isEditMode = !!user;
  const isSuperAdmin = currentUser?.role === 'SuperAdmin';

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
  } = useFormValidation(
    {
      email: user?.email || '',
      username: user?.username || '',
      password: '',
      role: (user?.role || 'User') as 'User' | 'Admin' | 'SuperAdmin',
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      isActive: user?.isActive !== undefined ? user.isActive : true,
    },
    {
      email: validationRules.email,
      username: validationRules.username(3),
      password: isEditMode ? validationRules.optional : validationRules.password(6),
      role: validationRules.required,
    },
  );

  useEffect(() => {
    if (isOpen) {
      resetForm({
        email: user?.email || '',
        username: user?.username || '',
        password: '',
        role: (user?.role || 'User') as 'User' | 'Admin' | 'SuperAdmin',
        firstName: user?.profile?.firstName || '',
        lastName: user?.profile?.lastName || '',
        isActive: user?.isActive !== undefined ? user.isActive : true,
      });
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    const userData: any = {
      email: values.email,
      username: values.username,
      role: values.role,
      firstName: values.firstName,
      lastName: values.lastName,
      isActive: values.isActive,
    };

    if (!isEditMode || values.password) {
      userData.password = values.password;
    }

    await execute(
      () => isEditMode && user
        ? usersApi.update(user.id, userData)
        : usersApi.create(userData),
      {
        successMessage: isEditMode
          ? MESSAGES.SUCCESS.USER_UPDATED
          : MESSAGES.SUCCESS.USER_CREATED,
        errorMessage: isEditMode
          ? MESSAGES.ERROR.USER_UPDATE_FAILED
          : MESSAGES.ERROR.USER_CREATE_FAILED,
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Oluştur'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-posta"
          type="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          error={touched.email ? errors.email : undefined}
          required
          labelColor="light"
        />
        <Input
          label="Kullanıcı Adı"
          type="text"
          value={values.username}
          onChange={(e) => handleChange('username', e.target.value)}
          onBlur={() => handleBlur('username')}
          error={touched.username ? errors.username : undefined}
          required
          labelColor="light"
        />
        <Input
          label={isEditMode ? 'Şifre (Değiştirmek için doldurun)' : 'Şifre'}
          type="password"
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          error={touched.password ? errors.password : undefined}
          required={!isEditMode}
          labelColor="light"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rol
          </label>
          <select
            value={values.role}
            onChange={(e) => handleChange('role', e.target.value as 'User' | 'Admin' | 'SuperAdmin')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="User">User</option>
            {isSuperAdmin && (
              <option value="Admin">Admin</option>
            )}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ad"
            type="text"
            value={values.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            labelColor="light"
          />
          <Input
            label="Soyad"
            type="text"
            value={values.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            labelColor="light"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={values.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
            Aktif
          </label>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditMode ? 'Güncelle' : 'Oluştur'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Category Modal Component
interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSuccess: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, category, onSuccess }) => {
  const { execute, isLoading } = useApiCall();
  const isEditMode = !!category;

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
  } = useFormValidation(
    {
      name: category?.name || '',
      description: category?.description || '',
    },
    {
      name: validationRules.required,
    },
  );

  useEffect(() => {
    if (isOpen) {
      resetForm({
        name: category?.name || '',
        description: category?.description || '',
      });
    }
  }, [isOpen, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    await execute(
      () => isEditMode && category
        ? categoriesApi.update(category.id, values)
        : categoriesApi.create(values),
      {
        successMessage: isEditMode
          ? MESSAGES.SUCCESS.CATEGORY_UPDATED
          : MESSAGES.SUCCESS.CATEGORY_CREATED,
        errorMessage: isEditMode
          ? MESSAGES.ERROR.CATEGORY_UPDATE_FAILED
          : MESSAGES.ERROR.CATEGORY_CREATE_FAILED,
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Kategori Düzenle' : 'Yeni Kategori Oluştur'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Kategori Adı"
          type="text"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          error={touched.name ? errors.name : undefined}
          required
          labelColor="light"
        />
        <Input
          label="Açıklama"
          as="textarea"
          rows={4}
          value={values.description}
          onChange={(e) => handleChange('description', e.target.value)}
          labelColor="light"
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditMode ? 'Güncelle' : 'Oluştur'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Story Modal Component
interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story | null;
  onSuccess: () => void;
}

const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose, story, onSuccess }) => {
  const { execute, isLoading } = useApiCall();
  const isEditMode = !!story;

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
  } = useFormValidation(
    {
      title: story?.title || '',
      content: story?.content || '',
      locationName: story?.locationName || '',
      isPublished: story?.isPublished !== undefined ? story.isPublished : true,
    },
    {
      title: validationRules.required,
      content: validationRules.required,
    },
  );

  useEffect(() => {
    if (isOpen) {
      resetForm({
        title: story?.title || '',
        content: story?.content || '',
        locationName: story?.locationName || '',
        isPublished: story?.isPublished !== undefined ? story.isPublished : true,
      });
    }
  }, [isOpen, story]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    await execute(
      () => isEditMode && story
        ? storiesApi.update(story.id, {
          title: values.title,
          content: values.content,
          locationName: values.locationName || undefined,
          isPublished: values.isPublished,
        })
        : storiesApi.create({
          title: values.title,
          content: values.content,
          locationName: values.locationName || undefined,
          isPublished: values.isPublished,
        }),
      {
        successMessage: isEditMode
          ? MESSAGES.SUCCESS.STORY_UPDATED
          : MESSAGES.SUCCESS.STORY_CREATED,
        errorMessage: isEditMode
          ? MESSAGES.ERROR.STORY_UPDATE_FAILED
          : MESSAGES.ERROR.STORY_CREATE_FAILED,
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Hikaye Düzenle' : 'Yeni Hikaye Oluştur'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Başlık"
          type="text"
          value={values.title}
          onChange={(e) => handleChange('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          error={touched.title ? errors.title : undefined}
          required
          labelColor="light"
        />
        <Input
          label="İçerik"
          as="textarea"
          rows={8}
          value={values.content}
          onChange={(e) => handleChange('content', e.target.value)}
          onBlur={() => handleBlur('content')}
          error={touched.content ? errors.content : undefined}
          required
          labelColor="light"
        />
        <Input
          label="Konum Adı"
          type="text"
          value={values.locationName}
          onChange={(e) => handleChange('locationName', e.target.value)}
          placeholder="Örn: İstanbul, Kadıköy"
          labelColor="light"
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublished"
            checked={values.isPublished}
            onChange={(e) => handleChange('isPublished', e.target.checked)}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
            Yayınla
          </label>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditMode ? 'Güncelle' : 'Oluştur'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// View User Modal Component
interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kullanıcı Detayları"
      size="lg"
    >
      <div className="space-y-6">
        {/* Kullanıcı Bilgileri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <span className={`inline-block px-2 py-1 rounded-full text-xs ${user.role === 'SuperAdmin' ? 'bg-orange-100 text-orange-800' :
              user.role === 'Admin' ? 'bg-amber-100 text-amber-800' :
                'bg-gray-100 text-gray-800'
              }`}>
              {user.role}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
            <span className={`inline-block px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              {user.isActive ? 'Aktif' : 'Pasif'}
            </span>
          </div>
        </div>

        {/* Profil Bilgileri */}
        {user.profile && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profil Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.profile.firstName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.profile.firstName}</p>
                </div>
              )}
              {user.profile.lastName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.profile.lastName}</p>
                </div>
              )}
              {user.profile.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.profile.phone}</p>
                </div>
              )}
              {user.profile.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.profile.location}</p>
                </div>
              )}
              {user.profile.bio && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Biyografi</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded whitespace-pre-wrap">{user.profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Avatar */}
        {user.profile?.avatar && (
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profil Fotoğrafı</label>
            <img
              src={user.profile.avatar}
              alt={`${user.username} profil fotoğrafı`}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button type="button" variant="secondary" onClick={onClose}>
            Kapat
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// View Story Modal Component
interface ViewStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story | null;
}

const ViewStoryModal: React.FC<ViewStoryModalProps> = ({ isOpen, onClose, story }) => {
  if (!story) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hikaye Detayları"
      size="xl"
    >
      <div className="space-y-6">
        {/* Başlık ve Temel Bilgiler */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{story.title}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <div>
              <span className="font-medium">Yazar:</span> {story.author?.username || 'Bilinmiyor'}
            </div>
            <div>
              <span className="font-medium">Durum:</span>{' '}
              <span className={`px-2 py-1 rounded-full text-xs ${story.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                {story.isPublished ? 'Yayında' : 'Taslak'}
              </span>
            </div>
            <div>
              <span className="font-medium">Oluşturulma:</span> {new Date(story.createdAt).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div>
              <span className="font-medium">Güncelleme:</span> {new Date(story.updatedAt).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        {/* İçerik */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-900 whitespace-pre-wrap">{story.content}</p>
          </div>
        </div>

        {/* Konum Bilgileri */}
        {(story.locationName || (story.latitude && story.longitude)) && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Konum Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {story.locationName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konum Adı</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{story.locationName}</p>
                </div>
              )}
              {story.latitude && story.longitude && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enlem (Latitude)</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{story.latitude}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Boylam (Longitude)</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{story.longitude}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Kategoriler */}
        {story.categories && story.categories.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategoriler</h3>
            <div className="flex flex-wrap gap-2">
              {story.categories.map((category) => (
                <span
                  key={category.id}
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Fotoğraflar */}
        {story.photos && story.photos.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fotoğraflar ({story.photos.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {story.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={photo}
                    alt={`${story.title} - Fotoğraf ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* İstatistikler */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">İstatistikler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{story.likes}</div>
              <div className="text-sm text-gray-600">Beğeni</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{story.dislikes}</div>
              <div className="text-sm text-gray-600">Beğenmeme</div>
            </div>
            {story.comments && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{story.comments.length}</div>
                <div className="text-sm text-gray-600">Yorum</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="button" variant="secondary" onClick={onClose}>
            Kapat
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminPanel;
