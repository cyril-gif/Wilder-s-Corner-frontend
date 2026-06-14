'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: { _id: string; name: string } | string;
  brand?: string;
  images?: string[];
  attributes?: {
    size?: string[];
    color?: string[];
    material?: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    category: '',
    brand: '',
    images: [] as File[],
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products?limit=100');
      setProducts(res.data.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm({ ...form, images: files });
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize('');
    }
  };

  const removeSize = (sizeToRemove: string) => {
    setSizes(sizes.filter(s => s !== sizeToRemove));
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', discountPrice: '', stock: '', category: '', brand: '', images: [] });
    setImagePreviews([]);
    setSizes([]);
    setNewSize('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    
    // Append form fields
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('discountPrice', form.discountPrice || '');
    formData.append('stock', form.stock);
    formData.append('category', form.category);
    formData.append('brand', form.brand || '');
    
    // Append sizes as JSON string
    if (sizes.length > 0) {
      formData.append('attributes', JSON.stringify({ size: sizes, color: [], material: '' }));
    }
    
    // Append images
    for (let i = 0; i < form.images.length; i++) {
      formData.append('images', form.images[i]);
    }
    
    try {
      if (editing) {
        await axios.put(`/admin/products/${editing}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchProducts();
      resetForm();
      alert(editing ? 'Product updated!' : 'Product created!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return <div className="text-center py-10">Loading products...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Manage Products</h1>

      {/* Add / Edit Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Edit Product' : 'Add New Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (₵)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Discount Price (₵)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.discountPrice}
                  onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Brand</Label>
                <Input
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="e.g., Nike, Adidas"
                />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <select
                className="w-full border rounded-md p-2 mt-1"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Management Section */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <Label className="font-semibold block mb-2">Sizes / Variants</Label>
              <p className="text-xs text-gray-500 mb-3">
                Add sizes like: 38, 39, 40, 41 (for shoes) or S, M, L, XL, XXL (for clothing)
              </p>
              <div className="flex gap-2 mb-3">
                <Input
                  type="text"
                  placeholder="Enter size (e.g., 40, M, XL, 7.5)"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                  className="flex-1"
                />
                <Button type="button" onClick={addSize} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {sizes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <div key={size} className="bg-white border rounded-full px-3 py-1 text-sm flex items-center gap-2">
                      <span>{size}</span>
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <Label>Product Images</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1"
              />
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative w-16 h-16">
                      <img src={src} alt="Preview" className="w-full h-full object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => {
                          const newPreviews = imagePreviews.filter((_, i) => i !== idx);
                          const newFiles = form.images.filter((_, i) => i !== idx);
                          setImagePreviews(newPreviews);
                          setForm({ ...form, images: newFiles });
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={submitting} className="bg-primary">
                {submitting ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
              </Button>
              {editing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Products List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Products ({products.length})</h2>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow p-3 flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{product.name}</div>
                <div className="text-sm text-primary">₵{product.price.toLocaleString()}</div>
                {product.attributes?.size && product.attributes.size.length > 0 && (
                  <div className="text-xs text-gray-500">Sizes: {product.attributes.size.join(', ')}</div>
                )}
                <div className="text-xs text-gray-500">Stock: {product.stock}</div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditing(product._id);
                    setForm({
                      name: product.name,
                      description: product.description,
                      price: product.price.toString(),
                      discountPrice: product.discountPrice?.toString() || '',
                      stock: product.stock.toString(),
                      category: typeof product.category === 'object' ? product.category._id : product.category,
                      brand: product.brand || '',
                      images: [],
                    });
                    setSizes(product.attributes?.size || []);
                    setImagePreviews([]);
                  }}
                  className="p-2 text-blue-600"
                >
                  ✏️
                </button>
                <button onClick={() => deleteProduct(product._id)} className="p-2 text-red-600">
                  🗑️
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && <div className="text-center text-gray-500 py-6">No products yet. Create your first product above.</div>}
        </div>
      </div>
    </div>
  );
}
