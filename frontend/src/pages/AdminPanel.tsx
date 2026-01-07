import { useState, useEffect } from 'react';
import { usersApi, categoriesApi, storiesApi } from '../services/api';
import { User, Category, Story } from '../types';
import toast from 'react-hot-toast';

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
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
    } catch (error: any) {
      toast.error('Veriler yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!window.confirm('Bu hikayeyi silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await storiesApi.delete(id);
      await loadData();
      toast.success('Hikaye silindi');
    } catch (error: any) {
      toast.error('Hikaye silinirken bir hata oluştu');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Yönetim Paneli</h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Kullanıcılar
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Kategoriler
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stories'
                ? 'border-blue-500 text-blue-600'
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
              <h2 className="text-xl font-semibold mb-4">Kullanıcılar ({users.length})</h2>
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
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'SuperAdmin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
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
              <h2 className="text-xl font-semibold mb-4">Kategoriler ({categories.length})</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
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
              <h2 className="text-xl font-semibold mb-4">Tüm Hikayeler ({stories.length})</h2>
              <div className="space-y-4">
                {stories.map((story) => (
                  <div key={story.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{story.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Yazar: {story.author.username} | 
                          {story.isPublished ? ' ✅ Yayında' : ' ⏸️ Taslak'} |
                          {new Date(story.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {story.content}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteStory(story.id)}
                        className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

