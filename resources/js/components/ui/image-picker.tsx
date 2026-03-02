import React, { useRef } from 'react'
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ImagePickerProps {
    label: string;
    preview: string | null;
    onFile: (f: File) => void;
    onClear: () => void;
}

export default function ImagePicker({ label, preview, onFile, onClear }: ImagePickerProps) {
    const ref = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    return (
        <div>
            <Label className="mb-2 block text-sm font-medium">{label}</Label>
            <div
                onClick={() => ref.current?.click()}
                className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-5 text-center cursor-pointer hover:border-orange-400 transition-colors group"
            >
                {preview ? (
                    <div className="relative inline-block">
                        <img src={preview} alt="preview" className="h-28 w-auto rounded-lg object-cover mx-auto" />
                        <button
                            type="button"
                            onClick={e => { e.stopPropagation(); onClear(); }}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                            <X size={10} />
                        </button>
                    </div>
                ) : (
                    <>
                        <Upload size={24} className="mx-auto mb-2 text-gray-400 group-hover:text-orange-500 transition-colors" />
                        <p className="text-sm text-gray-500">{t('image_picker.click_to_upload')}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{t('image_picker.file_hint')}</p>
                    </>
                )}
            </div>
            <input
                ref={ref}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }}
            />
        </div>
    );
}
