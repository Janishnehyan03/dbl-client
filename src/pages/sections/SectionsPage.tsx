// src/components/SectionTable.tsx
import React from "react";
import { Section } from "../../utils/types";

// src/pages/SectionsPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import { SectionTable } from "../../components/sections/SectionTable";
import { TableHeader } from "../../components/sections/SectionTableHeader";
import Axios from "../../utils/Axios";
import { SectionModal } from "../../components/sections/SectionModal";

const SectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hasDepartments: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await Axios.get("/sections");
      setSections(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    const val = e.target.type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const openAddModal = () => {
    setFormData({ name: "", description: "", hasDepartments: false });
    setIsAddModalOpen(true);
  };

  const openEditModal = (section: Section) => {
    setCurrentSection(section);
    setFormData({
      name: section.name || "",
      description: section.description || "",
      hasDepartments: section.hasDepartments || false,
    });
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!formData.name) throw new Error("Section name is required.");
      const response = await Axios.post("/sections", formData);
      setSections((prev) => [...prev, response.data]);
      setSuccess(true);
      setIsAddModalOpen(false);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add section");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!formData.name) throw new Error("Section name is required.");
      const response = await Axios.put(
        `/sections/${currentSection?._id}`,
        formData
      );
      setSections((prev) =>
        prev.map((sec) =>
          sec._id === currentSection?._id ? response.data : sec
        )
      );
      setSuccess(true);
      setIsEditModalOpen(false);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update section");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      setLoading(true);
      setError(null);
      try {
        await Axios.delete(`/sections/${id}`);
        setSections((prev) => prev.filter((sec) => sec._id !== id));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete section");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className=" bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <TableHeader
          onAddClick={openAddModal}
          onBackClick={() => navigate("/catalog-matched/books")}
        />
        <SectionTable
          sections={sections}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
        {error && <FeedbackMessage type="error" message={error || ""} />}
        {success && <FeedbackMessage type="success" message="Success!" />}

        <SectionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
          formData={formData}
          onInputChange={handleInputChange}
          loading={loading}
          title="Add New Section"
        />
        <SectionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          formData={formData}
          onInputChange={handleInputChange}
          loading={loading}
          title="Edit Section"
        />
      </div>
    </div>
  );
};

export default SectionsPage;
