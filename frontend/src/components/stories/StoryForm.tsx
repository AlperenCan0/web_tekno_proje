import { useState, useEffect } from 'react';
import { categoriesApi, uploadApi } from '../../services/api';
import { Category, Story } from '../../types';
import { getPhotoUrl } from '../../config';
import LocationPicker from '../LocationPicker';
import toast from 'react-hot-toast';

/**
 * StoryFormData - Form verileri için tip
 */
export interface StoryFormData {
    title: string;
    content: string;
    latitude: string;
    longitude: string;
    locationName: string;
    selectedCategories: string[];
    photos: string[];
    isPublished: boolean;
}

/**
 * StoryForm Props
 */
interface StoryFormProps {
    mode: 'create' | 'edit';
    initialData?: Partial<Story>;
    onSubmit: (data: StoryFormData) => Promise<void>;
    onCancel: () => void;
    submitButtonText?: string;
    isSubmitting?: boolean;
}

/**
 * StoryForm Component - Reusable hikaye formu
 * CreateStory ve EditStory sayfaları tarafından kullanılır
 */
const StoryForm: React.FC<StoryFormProps> = ({
    mode,
    initialData,
    onSubmit,
    onCancel,
    submitButtonText,
    isSubmitting = false,
}) => {
    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [locationName, setLocationName] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [photos, setPhotos] = useState<string[]>([]);
    const [isPublished, setIsPublished] = useState(true);

    // Categories ve upload state
    const [categories, setCategories] = useState<Category[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

    // Initial data yükleme (edit mode)
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setContent(initialData.content || '');
            setLatitude(initialData.latitude?.toString() || '');
            setLongitude(initialData.longitude?.toString() || '');
            setLocationName(initialData.locationName || '');
            setPhotos(initialData.photos || []);
            setIsPublished(initialData.isPublished ?? true);
            setSelectedCategories(initialData.categories?.map((cat) => cat.id) || []);
        }
    }, [initialData]);

    // Kategorileri yükle
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setIsCategoriesLoading(true);
            const categoriesData = await categoriesApi.getAll();
            setCategories(categoriesData);
        } catch (error) {
            toast.error('Kategoriler yüklenirken bir hata oluştu');
        } finally {
            setIsCategoriesLoading(false);
        }
    };

    // Fotoğraf yükleme
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const uploadPromises = Array.from(files).map((file) => uploadApi.uploadPhoto(file));
            const results = await Promise.all(uploadPromises);
            const newPhotos = results.map((result) => result.url);
            setPhotos((prev) => [...prev, ...newPhotos]);
            toast.success('Fotoğraflar yüklendi');
        } catch (error) {
            toast.error('Fotoğraf yüklenirken bir hata oluştu');
        } finally {
            setIsUploading(false);
            // Input'u temizle (aynı dosyaları tekrar seçebilmek için)
            e.target.value = '';
        }
    };

    // Fotoğraf silme
    const handleRemovePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    // Kategori toggle
    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            toast.error('Başlık ve içerik zorunludur');
            return;
        }

        await onSubmit({
            title,
            content,
            latitude,
            longitude,
            locationName,
            selectedCategories,
            photos,
            isPublished,
        });
    };

    const buttonText = submitButtonText || (mode === 'create' ? 'Hikaye Oluştur' : 'Güncelle');
    const loadingText = mode === 'create' ? 'Oluşturuluyor...' : 'Güncelleniyor...';

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            {/* Başlık */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık *
                </label>
                <input
                    id="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hikaye başlığı"
                />
            </div>

            {/* İçerik */}
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik *
                </label>
                <textarea
                    id="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hikaye içeriği"
                />
            </div>

            {/* Konum Seçimi */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konum Seçimi
                </label>
                <div className="mb-4">
                    <LocationPicker
                        latitude={latitude ? parseFloat(latitude) : undefined}
                        longitude={longitude ? parseFloat(longitude) : undefined}
                        onLocationSelect={(lat, lng) => {
                            setLatitude(lat.toString());
                            setLongitude(lng.toString());
                        }}
                        height="400px"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                            Enlem (Latitude)
                        </label>
                        <input
                            id="latitude"
                            type="number"
                            step="any"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="41.0082"
                        />
                    </div>
                    <div>
                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                            Boylam (Longitude)
                        </label>
                        <input
                            id="longitude"
                            type="number"
                            step="any"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="28.9784"
                        />
                    </div>
                </div>
            </div>

            {/* Lokasyon Adı */}
            <div>
                <label htmlFor="locationName" className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasyon Adı
                </label>
                <input
                    id="locationName"
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="İstanbul, Kadıköy"
                />
            </div>

            {/* Kategoriler */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoriler
                </label>
                {isCategoriesLoading ? (
                    <div className="text-gray-500 text-sm">Kategoriler yükleniyor...</div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => handleCategoryToggle(category.id)}
                                className={`px-4 py-2 rounded-full text-sm transition-colors ${selectedCategories.includes(category.id)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fotoğraflar */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fotoğraflar
                </label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                {isUploading && <p className="text-sm text-blue-600 mt-2">Yükleniyor...</p>}
                {photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                        {photos.map((photo, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={getPhotoUrl(photo)}
                                    alt={`Fotoğraf ${index + 1}`}
                                    className="w-full h-32 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(index)}
                                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Fotoğrafı kaldır"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Yayınla Checkbox */}
            <div className="flex items-center">
                <input
                    id="isPublished"
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                    {mode === 'create' ? 'Hemen yayınla' : 'Yayınla'}
                </label>
            </div>

            {/* Butonlar */}
            <div className="flex space-x-4">
                <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {isSubmitting ? loadingText : buttonText}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 transition-colors"
                >
                    İptal
                </button>
            </div>
        </form>
    );
};

export default StoryForm;
