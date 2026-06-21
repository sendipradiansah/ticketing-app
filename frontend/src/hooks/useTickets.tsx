"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
// 1. IMPOR LIBRARY EXPORT DI BAGIAN ATAS
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface Ticket {
  id: number;
  title: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  createdBy?: { name: string };
}

export const useTickets = (itemsPerPage: number = 5) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const profRes = await axios.get('http://localhost:3000/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        setRole(profRes.data.role);

        const ticketRes = await axios.get('http://localhost:3000/tickets', { headers: { Authorization: `Bearer ${token}` } });
        setTickets(ticketRes.data);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => setCurrentPage(1), [search, statusFilter, categoryFilter]);

  const filteredTickets = tickets.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toString().includes(search);
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchCategory = categoryFilter === 'ALL' || t.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ==========================================
  // 2. FUNGSI EKSPOR EXCEL
  // ==========================================
  const exportToExcel = () => {
    const dataToExport = filteredTickets.map(t => ({
      'Ticket ID': t.id,
      'Subject': t.title,
      'Category': t.category,
      'Priority': t.priority,
      'Status': t.status,
      'Created Date': new Date(t.createdAt).toLocaleString('id-ID'),
      'Author': t.createdBy?.name || 'Unknown'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
    XLSX.writeFile(workbook, "Ticket_Report.xlsx");
  };

  // ==========================================
  // 3. FUNGSI EKSPOR PDF
  // ==========================================
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Ticket Repository Report", 14, 15);

    const tableColumn = ["ID", "Subject", "Category", "Priority", "Status", "Author", "Date"];
    const tableRows = filteredTickets.map(t => [
      t.id.toString(),
      t.title,
      t.category,
      t.priority,
      t.status,
      t.createdBy?.name || 'Unknown',
      new Date(t.createdAt).toLocaleDateString('id-ID')
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [6, 182, 212] }, // Warna header tabel (Cyan)
    });

    doc.save("Ticket_Report.pdf");
  };

  // 4. LEMPAR FUNGSI EXPORT KE UI
  return {
    role, loading,
    search, setSearch,
    statusFilter, setStatusFilter,
    categoryFilter, setCategoryFilter,
    currentPage, setCurrentPage,
    totalPages, paginatedTickets,
    exportToExcel, exportToPDF // <-- Tambahkan di sini
  };
};