'use client';

import { useState } from 'react';
import { useGetPackagesQuery, useCreatePackageMutation, useUpdatePackageMutation, useDeletePackageMutation } from '@/lib/features/packages/packagesApiSlice';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { getPackageImage } from '@/lib/imageHelper';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Clock, 
  MapPin, 
  Image as ImageIcon,
  Inbox
} from 'lucide-react';

export default function AdminPackages() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  // Basic authorization check
  if (user && user.role !== 'admin') {
    router.push('/');
    return null;
  }

  const { data, isLoading, refetch } = useGetPackagesQuery({ limit: 100 });
  const [createPackage] = useCreatePackageMutation();
  const [updatePackage] = useUpdatePackageMutation();
  const [deletePackage] = useDeletePackageMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, control } = useForm();
  
  // Watch image field to show live preview
  const watchedImage = watch('image');
  const watchedDestination = watch('destination');

  const onSubmit = async (formData: any) => {
    const payload = {
      ...formData,
      price: Number(formData.price),
      duration: Number(formData.duration),
      availableSeats: Number(formData.availableSeats),
      image: formData.image || 'no-photo.jpg'
    };

    try {
      if (isEditing && editId) {
        await updatePackage({ id: editId, ...payload }).unwrap();
        toast.success('Package updated successfully');
      } else {
        await createPackage(payload).unwrap();
        toast.success('Package created successfully');
      }
      setIsEditing(false);
      setEditId(null);
      reset({
        title: '',
        destination: '',
        description: '',
        price: '',
        duration: '',
        availableSeats: '',
        startDate: '',
        image: ''
      });
      refetch(); // Refetch the list to sync frontend state
      router.push('/packages');
    } catch (err: any) {
      toast.error(err.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (pkg: any) => {
    setIsEditing(true);
    setEditId(pkg._id);
    reset({
      title: pkg.title,
      destination: pkg.destination,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      availableSeats: pkg.availableSeats,
      startDate: new Date(pkg.startDate).toISOString().split('T')[0],
      image: pkg.image === 'no-photo.jpg' ? '' : pkg.image,
    });
    // Scroll window smoothly to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this package? This will remove it from search results.')) {
      try {
        await deletePackage(id).unwrap();
        toast.success('Package deleted successfully');
        refetch();
      } catch (err: any) {
        toast.error(err.data?.message || 'Failed to delete package');
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    reset({
      title: '',
      destination: '',
      description: '',
      price: '',
      duration: '',
      availableSeats: '',
      startDate: '',
      image: '',
    });
  };

  const packages = data?.data?.packages || [];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12 relative overflow-hidden mb-10">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-slate-300 max-w-xl text-sm md:text-base">
            Create, update, and manage your travel package catalog. Custom image URLs and seats-left counters are synced live.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-205 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-primary-600 font-bold tracking-wider text-2xs uppercase block mb-1">Package Form</span>
              <h2 className="text-xl font-black text-slate-900">{isEditing ? 'Edit Existing Package' : 'Add New Package'}</h2>
            </div>

            {/* Live Image Preview Helper */}
            <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <img 
                src={getPackageImage(watchedDestination || '', watchedImage || '')} 
                alt="Form Preview"
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 right-2 bg-slate-900/60 backdrop-blur-md px-2 py-0.5 rounded text-2xs font-bold text-white uppercase tracking-wider">
                Live Preview
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">Title</label>
                <input 
                  {...register('title')} 
                  required 
                  placeholder="e.g. Maldives Family Vacation"
                  className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">Destination</label>
                <input 
                  {...register('destination')} 
                  required 
                  placeholder="e.g. Maldives"
                  className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Image URL (Optional)</span>
                </label>
                <input 
                  {...register('image')} 
                  placeholder="https://images.unsplash.com/... or blank for auto"
                  className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                />
                <span className="text-3xs text-slate-400 block mt-0.5 leading-normal">
                  Provide a direct http/https link to a photo, or leave empty to automatically fetch a beautiful destination image.
                </span>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <textarea 
                  {...register('description')} 
                  required 
                  rows={3} 
                  placeholder="Describe details, accommodations, flight info..."
                  className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    {...register('price')} 
                    required 
                    min="0" 
                    placeholder="1200"
                    className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">Duration (Days)</label>
                  <input 
                    type="number" 
                    {...register('duration')} 
                    required 
                    min="1" 
                    placeholder="5"
                    className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">Available Seats</label>
                  <input 
                    type="number" 
                    {...register('availableSeats')} 
                    required 
                    min="0" 
                    placeholder="10"
                    className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">Start Date</label>
                  <Controller
                    control={control}
                    name="startDate"
                    rules={{ required: 'Start date is required' }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date, dateString) => field.onChange(dateString)}
                        className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-[42px]"
                        format="YYYY-MM-DD"
                        placeholder="Select start date"
                      />
                    )}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 border-dashed">
                {isEditing && (
                  <button 
                    type="button" 
                    onClick={handleCancelEdit} 
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 shadow-md shadow-primary-600/10 flex items-center gap-1.5 transition ml-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isEditing ? 'Update Package' : 'Add Package'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Packages Table/List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-black text-slate-900">Active Package List</h2>
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-slate-400 font-medium">Loading packages list...</div>
              ) : packages.length === 0 ? (
                <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-4">
                  <Inbox className="w-12 h-12 text-slate-300" />
                  <div>
                    <h4 className="font-bold text-slate-700">No Packages Created</h4>
                    <p className="text-xs text-slate-400 mt-1">Use the package form to register your first travel package.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {packages.map((pkg: any) => (
                    <div 
                      key={pkg._id} 
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-205 transition gap-4"
                    >
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-center gap-3.5">
                        <img 
                          src={getPackageImage(pkg.destination, pkg.image)} 
                          alt={pkg.title} 
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                        />
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base line-clamp-1">{pkg.title}</h3>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-primary-500" />
                            <span>{pkg.destination}</span>
                          </p>
                          <div className="flex gap-3 text-2xs text-slate-500 font-semibold mt-1">
                            <span className="flex items-center gap-0.5">
                              <DollarSign className="w-3 h-3 text-slate-400" />
                              <span>{pkg.price}</span>
                            </span>
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{pkg.duration} days</span>
                            </span>
                            <span className="flex items-center gap-0.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{new Date(pkg.startDate).toLocaleDateString(undefined, { dateStyle: 'short' })}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions & Seat Status */}
                      <div className="flex sm:flex-col items-end gap-3.5 w-full sm:w-auto shrink-0 justify-between sm:justify-start border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                        <div>
                          {pkg.availableSeats === 0 ? (
                            <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-2xs font-black uppercase tracking-wider border border-red-100">
                              Sold Out
                            </span>
                          ) : (
                            <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-2xs font-black uppercase tracking-wider">
                              {pkg.availableSeats} Seats Left
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(pkg)} 
                            className="bg-white hover:bg-slate-100 text-indigo-600 hover:text-indigo-700 p-2 rounded-xl text-xs font-bold transition border border-slate-200 shadow-sm flex items-center gap-1"
                            title="Edit Package"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(pkg._id)} 
                            className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700 p-2 rounded-xl text-xs font-bold transition border border-slate-200 shadow-sm flex items-center gap-1"
                            title="Delete Package"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
