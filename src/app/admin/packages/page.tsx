'use client';

import { useState } from 'react';
import { useGetPackagesQuery, useCreatePackageMutation, useUpdatePackageMutation, useDeletePackageMutation } from '@/lib/features/packages/packagesApiSlice';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function AdminPackages() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  // Basic authorization check
  if (user && user.role !== 'admin') {
    router.push('/');
    return null;
  }

  const { data, isLoading } = useGetPackagesQuery({ limit: 100 });
  const [createPackage] = useCreatePackageMutation();
  const [updatePackage] = useUpdatePackageMutation();
  const [deletePackage] = useDeletePackageMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (formData: any) => {
    const payload = {
      ...formData,
      price: Number(formData.price),
      duration: Number(formData.duration),
      availableSeats: Number(formData.availableSeats),
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
      reset();
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
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        await deletePackage(id).unwrap();
        toast.success('Package deleted successfully');
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
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Packages</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Package' : 'Add New Package'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input {...register('title')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Destination</label>
            <input {...register('destination')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea {...register('description')} required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border px-3 py-2"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input type="number" {...register('price')} required min="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (Days)</label>
            <input type="number" {...register('duration')} required min="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Available Seats</label>
            <input type="number" {...register('availableSeats')} required min="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" {...register('startDate')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border px-3 py-2" />
          </div>
          
          <div className="md:col-span-2 flex justify-end gap-2 mt-4">
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
            )}
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
              {isEditing ? 'Update Package' : 'Add Package'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {data?.data?.packages?.map((pkg: any) => (
              <li key={pkg._id} className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div>
                  <h3 className="text-lg font-medium text-primary-600">{pkg.title}</h3>
                  <p className="text-sm text-gray-500">{pkg.destination} | ${pkg.price} | {pkg.availableSeats} seats left</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(pkg)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(pkg._id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
