import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { loanService } from '../../services/loanService';
import Button from '../ui/Button';

const fileIcon = (fileType = '') => {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('image')) return '🖼️';
  return '📎';
};

const DocumentUploader = ({ loanId, documents = [], onChange, canEdit }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleFiles = async (files) => {
    if (!files?.length) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('documents', file));

    setUploading(true);
    try {
      const res = await loanService.uploadDocuments(loanId, formData);
      onChange(res.documents);
      toast.success('Document uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDelete = async (docId) => {
    setDeletingId(docId);
    try {
      const res = await loanService.deleteDocument(loanId, docId);
      onChange(res.documents);
    } catch (err) {
      toast.error(err.message || 'Could not delete document');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {documents.length === 0 ? (
        <p className="mb-3 text-sm text-ledger-slate">No documents attached yet.</p>
      ) : (
        <ul className="mb-3 space-y-2">
          {documents.map((doc) => (
            <li key={doc._id} className="flex items-center justify-between rounded-lg border border-ledger-line px-3 py-2 text-sm dark:border-ledger-lineDark">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-ledger-navy hover:underline dark:text-ledger-cream"
              >
                <span>{fileIcon(doc.fileType)}</span>
                <span className="max-w-[200px] truncate">{doc.originalName}</span>
              </a>
              {canEdit && (
                <button
                  onClick={() => handleDelete(doc._id)}
                  disabled={deletingId === doc._id}
                  className="text-xs text-red-600 hover:underline disabled:opacity-50"
                >
                  {deletingId === doc._id ? 'Removing…' : 'Remove'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {canEdit && (
        <>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.webp"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button variant="secondary" onClick={() => inputRef.current?.click()} loading={uploading}>
            Upload document
          </Button>
          <p className="mt-1.5 text-xs text-ledger-slate">PDF, image, or Word docs up to 5MB each.</p>
        </>
      )}
    </div>
  );
};

export default DocumentUploader;
