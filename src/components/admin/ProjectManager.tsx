import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useStore } from '@/store/useStore';
import type { BridgeProject } from '@/types';
import { Plus, Edit2, Trash2, QrCode, ImageIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function ProjectManager() {
  const { projects, addProject, updateProject, deleteProject } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<BridgeProject | null>(null);
  const [showQR, setShowQR] = useState<BridgeProject | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    teamName: '',
    imageUrl: '',
    videoUrl: '',
    technicalSheet: '',
    description: '',
  });

  const baseUrl = window.location.origin + '/bridge-contest';

  const openCreateForm = () => {
    setFormData({ name: '', teamName: '', imageUrl: '', videoUrl: '', technicalSheet: '', description: '' });
    setEditingProject(null);
    setShowForm(true);
  };

  const openEditForm = (project: BridgeProject) => {
    setFormData({
      name: project.name,
      teamName: project.teamName,
      imageUrl: project.imageUrl,
      videoUrl: project.videoUrl || '',
      technicalSheet: project.technicalSheet || '',
      description: project.description || '',
    });
    setEditingProject(project);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.teamName.trim()) return;

    if (editingProject) {
      updateProject(editingProject.id, formData);
    } else {
      const newProject: BridgeProject = {
        id: `bridge-${Date.now()}`,
        code: `PTE-${String(projects.length + 1).padStart(3, '0')}`,
        imageUrl: formData.imageUrl || '/bridge-contest/images/bridge-placeholder.svg',
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addProject(newProject);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    setShowDeleteConfirm(null);
  };

  const downloadQR = (project: BridgeProject, format: 'png' | 'svg') => {
    const url = `${baseUrl}/#/vote/${project.id}`;
    if (format === 'svg') {
      const svgElement = document.getElementById(`qr-${project.id}`);
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `QR-${project.code}-${project.name}.svg`;
        link.click();
      }
    } else {
      const canvas = document.createElement('canvas');
      const svgElement = document.getElementById(`qr-${project.id}`);
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const img = new Image();
        img.onload = () => {
          canvas.width = 300;
          canvas.height = 300;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 300, 300);
            ctx.drawImage(img, 0, 0, 300, 300);
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `QR-${project.code}-${project.name}.png`;
            link.click();
          }
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Gestion de Proyectos</h3>
          <Button size="sm" onClick={openCreateForm}>
            <Plus className="w-4 h-4" /> Nuevo Proyecto
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-12 h-12 object-cover rounded-lg bg-gray-200 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/bridge-contest/images/bridge-placeholder.svg';
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: '#273475', backgroundColor: '#273475' + '15' }}>
                        {project.code}
                      </span>
                      <p className="font-semibold text-gray-800 text-sm">{project.name}</p>
                    </div>
                    <p className="text-xs text-gray-500">{project.teamName}</p>
                    {!project.imageUrl || project.imageUrl.includes('placeholder') ? (
                      <p className="text-[10px] text-amber-600 flex items-center gap-0.5 mt-0.5">
                        <ImageIcon className="w-3 h-3" /> Sin foto del puente
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQR(project)}
                    className="p-2 hover:bg-[#273475]/10 rounded-lg text-[#273475] transition-colors"
                    title="Ver QR"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditForm(project)}
                    className="p-2 hover:bg-amber-100 rounded-lg text-amber-600 transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(project.id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Puente *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#273475]/40 outline-none"
              placeholder="Ej: Puente Nexus"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Equipo *</label>
            <input
              type="text"
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#273475]/40 outline-none"
              placeholder="Ej: Equipo Nexus"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <ImageIcon className="w-4 h-4 inline mr-1" />
              Imagen del Puente (URL)
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#273475]/40 outline-none"
              placeholder="https://ejemplo.com/foto-puente.jpg"
            />
            <p className="text-xs text-gray-400 mt-1">Pegue la URL de la foto del puente (JPG, PNG, etc.). Puede usar Google Drive, Imgur u otro servicio de imagenes.</p>
            {formData.imageUrl && (
              <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover bg-gray-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">URL de Video</label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#273475]/40 outline-none"
              placeholder="https://youtube.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">URL Ficha Tecnica</label>
            <input
              type="url"
              value={formData.technicalSheet}
              onChange={(e) => setFormData({ ...formData, technicalSheet: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#273475]/40 outline-none"
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="ghost" className="flex-1" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleSave}>
              {editingProject ? 'Actualizar' : 'Crear Proyecto'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* QR Modal */}
      <Modal
        isOpen={!!showQR}
        onClose={() => setShowQR(null)}
        title={`Codigo QR - ${showQR?.name || ''}`}
        size="sm"
      >
        {showQR && (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white border-2 border-gray-100 rounded-xl">
              <QRCodeSVG
                id={`qr-${showQR.id}`}
                value={`${baseUrl}/#/vote/${showQR.id}`}
                size={200}
                level="H"
                includeMargin
              />
            </div>
            <p className="text-xs text-gray-500 text-center break-all">
              {baseUrl}/#/vote/{showQR.id}
            </p>
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => downloadQR(showQR, 'png')}
              >
                Descargar PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => downloadQR(showQR, 'svg')}
              >
                Descargar SVG
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Eliminar Proyecto"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Esta seguro de eliminar este proyecto? Se perderan todos los votos asociados.
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button variant="danger" className="flex-1" onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
