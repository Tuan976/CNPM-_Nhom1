import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit3, Trash2, Tag, Layers, ArrowUpDown } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const InventoryManager = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (q = '') => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/?q=${q}`);
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="relative w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Tìm kiếm mã vạch, tên SP..." 
            className="w-full bg-slate-50 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm outline-none border-2 border-transparent focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); fetchProducts(e.target.value); }}
          />
        </div>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20">
          <Plus size={20} /> Nhập hàng mới
        </button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40">Sản phẩm</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40 text-center">Đơn vị</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40 text-center">Tồn kho</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40 text-right">Giá bán</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((p) => (
              <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={p.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="p-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="font-black theme-text uppercase text-sm leading-none mb-1">{p.name}</p>
                            <p className="text-[10px] font-bold opacity-30 tracking-widest uppercase">Mã: {p.barcode}</p>
                        </div>
                    </div>
                </td>
                <td className="p-8 text-center"><span className="text-xs font-black uppercase opacity-60">{p.unit}</span></td>
                <td className="p-8 text-center">
                    <span className={`px-4 py-2 rounded-xl font-black text-xs ${p.stock < 15 ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'}`}>
                        {p.stock}
                    </span>
                </td>
                <td className="p-8 text-right font-black text-blue-600">{p.price.toLocaleString()}đ</td>
                <td className="p-8">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl"><Edit3 size={18}/></button>
                        <button className="p-3 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18}/></button>
                    </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManager;
