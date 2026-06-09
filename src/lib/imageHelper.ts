export function getPackageImage(destination: string, customImage?: string): string {
  if (customImage && customImage !== 'no-photo.jpg' && customImage.trim() !== '') {
    if (customImage.startsWith('http://') || customImage.startsWith('https://')) {
      return customImage;
    }
  }

  const destLower = (destination || '').toLowerCase();
  
  if (destLower.includes('maldives')) {
    return 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80';
  }
  if (destLower.includes('paris') || destLower.includes('france')) {
    return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80';
  }
  if (destLower.includes('tokyo') || destLower.includes('japan') || destLower.includes('kyoto')) {
    return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80';
  }
  if (destLower.includes('bali') || destLower.includes('indonesia')) {
    return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80';
  }
  if (destLower.includes('rome') || destLower.includes('italy')) {
    return 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80';
  }
  if (destLower.includes('london') || destLower.includes('uk') || destLower.includes('england')) {
    return 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80';
  }
  if (destLower.includes('swiss') || destLower.includes('switzerland')) {
    return 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80';
  }
  if (destLower.includes('new york') || destLower.includes('usa') || destLower.includes('america')) {
    return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80';
  }
  if (destLower.includes('dubai') || destLower.includes('uae')) {
    return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80';
  }
  if (destLower.includes('sydney') || destLower.includes('australia')) {
    return 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80';
  }
  if (destLower.includes('greece') || destLower.includes('santorini')) {
    return 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80';
  }
  if (destLower.includes('egypt') || destLower.includes('cairo')) {
    return 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80';
  }

  // General travel fallback
  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
}
