import Image from 'next/image'

export default function ArtworkCard({ title, image, dynasty, category }) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-gray-800">
      <div className="relative aspect-square">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="truncate text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{dynasty}</span>
          <span>{category}</span>
        </div>
      </div>
    </div>
  )
}
