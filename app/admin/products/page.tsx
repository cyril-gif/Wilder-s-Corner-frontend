'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    category: '',
    brand: '',
    images: []
  });

  useEffect(() => {
    fetchProducts();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key === 'images') {
        for (let i = 0; i < form.images.length; i++) {
          formData.append('images', form.images[i]);
        }
      } else {
        formData.append(key, form[key]);
      }
    });

    try {
      if (editing) {
        await axios.put(`/admin/products/${editing}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchProducts();
      resetForm();
    } catch (err) {
      alert('Failed to save product');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', discountPrice: '', stock: '', category: '', brand: '', images: [] });
  };

  const deleteProduct = async (id) => {
    if (confirm('Delete this product?')) {
      await axios.delete(`/admin/products/${id}`);
      fetchProducts();
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editing ? 'Edit Product' : 'Add New Product'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price</Label>
                  <Input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                </div>
                <div>
                  <Label>Discount Price</Label>
                  <Input type="number" value={form.discountPrice} onChange={e => setForm({...form, discountPrice: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Stock</Label>
                  <Input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
                </div>
                <div>
                  <Label>Brand</Label>
                  <Input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
                </div>
              </div>
              <div>
                <Label>Category ID</Label>
                <Input value={form.category} onChange={e => setForm({...form, category: e.target.value})} required placeholder="Enter category ID" />
              </div>
              <div>
                <Label>Images</Label>
                <Input type="file" multiple accept="image/*" onChange={e => setForm({...form, images: Array.from(e.target.files)})} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-primary">{editing ? 'Update' : 'Create'}</Button>
                {editing && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
              </div>
            </form>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-lg font-semibold mb-4">Existing Products</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {products.map((p: any) => (
              <div key={p._id} className="flex justify-between items-center bg-white p-3 rounded shadow">
                <div className="flex items-center gap-3">
                  {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded" />}
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm">₦{p.price}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    setEditing(p._id);
                    setForm({
                      name: p.name,
                      description: p.description,
                      price: p.price,
                      discountPrice: p.discountPrice || '',
                      stock: p.stock,
                      category: p.category?._id || p.category,
                      brand: p.brand || '',
                      images: []
                    });
                  }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteProduct(p._id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
