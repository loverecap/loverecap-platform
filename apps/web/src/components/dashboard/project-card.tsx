import Link from 'next/link'
import { Heart, Calendar, ExternalLink, PenLine } from 'lucide-react'
import { formatDate } from '@loverecap/utils'
import type { Project } from '@loverecap/database'

interface ProjectCardProps {
  project: Project
}

const statusConfig = {
  draft: {
    label: 'Rascunho',
    className: 'bg-amber-50 text-amber-600 border border-amber-200',
  },
  published: {
    label: 'Publicado',
    className: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  },
  deleted: {
    label: 'Removido',
    className: 'bg-neutral-100 text-neutral-500 border border-neutral-200',
  },
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = statusConfig[project.status as keyof typeof statusConfig] ?? statusConfig.draft
  const formattedDate = formatDate(project.relationship_start_date, 'pt-BR')

  return (
    <div className="group relative bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md hover:border-[#FF4D6D]/30 transition-all duration-200">
      {/* Cover / gradient header */}
      <div
        className="h-28 w-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #FFF8F2 0%, #F5E9E2 55%, #F8C8DC 100%)',
        }}
      >
        <Heart className="h-8 w-8 fill-[#FF4D6D]/40 text-[#FF4D6D]/40" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Status badge */}
        <span className={`inline-block text-[10px] font-semibold uppercase tracking-widest rounded-full px-2.5 py-1 mb-3 ${status.className}`}>
          {status.label}
        </span>

        {/* Names */}
        <h3 className="font-heading font-bold text-neutral-900 text-lg leading-tight mb-1">
          {project.partner_name_1}
          <span className="text-[#FF4D6D]"> & </span>
          {project.partner_name_2}
        </h3>

        {/* Start date */}
        <p className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          Desde {formattedDate}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          {project.status === 'published' && project.slug ? (
            <>
              <Link
                href={`/s/${project.slug}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#FF4D6D] text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#FF2E63] transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Ver história
              </Link>
            </>
          ) : (
            <Link
              href="/create/review"
              className="flex-1 inline-flex items-center justify-center gap-1.5 border border-neutral-200 text-neutral-700 text-xs font-semibold px-3 py-2 rounded-full hover:border-[#FF4D6D] hover:text-[#FF4D6D] transition-colors"
            >
              <PenLine className="h-3.5 w-3.5" />
              Continuar editando
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
