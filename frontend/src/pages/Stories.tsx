import { useState, useEffect, useMemo } from 'react';
import { storiesApi, categoriesApi } from '../services/api';
import { Story, Category } from '../types';
import StoryMap from '../components/StoryMap';
import { StoryCard, SearchBar, FilterBar } from '../components/stories';
import { Spinner } from '../components/ui';
import { Container } from '../components/layout';
import { Button } from '../components/ui';
import { List, Map, BookOpen } from 'lucide-react';
import { useApiCall } from '../hooks/useApiCall';
import { MESSAGES } from '../constants/messages';

/**
 * Stories Page Component - Tüm hikayeleri listeler
 * Harita görünümü ve liste görünümü arasında geçiş yapılabilir
 */
const Stories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const { execute: executeApiCall, isLoading } = useApiCall<[Story[], Category[]]>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await executeApiCall(
      async () => {
        const [storiesData, categoriesData] = await Promise.all([
          storiesApi.getAll(true),
          categoriesApi.getAll(),
        ]);
        return [storiesData, categoriesData] as [Story[], Category[]];
      },
      {
        errorMessage: MESSAGES.ERROR.STORIES_LOAD_FAILED,
        onSuccess: (data) => {
          if (data) {
            setStories(data[0]);
            setCategories(data[1]);
          }
        },
        showToast: false,
      },
    );
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredAndSortedStories = useMemo(() => {
    let filtered = stories;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((story) =>
        story.categories?.some((cat) => selectedCategories.includes(cat.id))
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(query) ||
          story.content.toLowerCase().includes(query) ||
          story.locationName?.toLowerCase().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return (b.likes + (b.comments?.length || 0)) - (a.likes + (a.comments?.length || 0));
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

    return sorted;
  }, [stories, selectedCategories, searchQuery, sortBy]);

  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" text="Hikayeler yükleniyor..." />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Hikayeler
          </h1>
          <p className="text-gray-600">
            {filteredAndSortedStories.length} hikaye bulundu
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            leftIcon={<List className="w-4 h-4" />}
          >
            Liste
          </Button>
          <Button
            variant={viewMode === 'map' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('map')}
            leftIcon={<Map className="w-4 h-4" />}
          >
            Harita
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Hikaye başlığı, içerik veya lokasyon ara..."
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        onClearCategories={() => setSelectedCategories([])}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Content */}
      {viewMode === 'map' ? (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6 relative z-0">
          <StoryMap stories={filteredAndSortedStories} />
        </div>
      ) : (
        <>
          {filteredAndSortedStories.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedStories.map((story, index) => (
                <StoryCard key={story.id} story={story} delay={index * 0.05} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery || selectedCategories.length > 0 ? 'Sonuç bulunamadı' : 'Henüz hikaye yok'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery || selectedCategories.length > 0
                  ? 'Farklı bir arama terimi veya kategori deneyin'
                  : 'İlk hikayeyi paylaşmak için giriş yapın'}
              </p>
              {searchQuery || selectedCategories.length > 0 ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategories([]);
                  }}
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  Filtreleri Temizle
                </button>
              ) : null}
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default Stories;

