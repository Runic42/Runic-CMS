'use client'

import { ContentObject } from '@/types/content'

interface ContentRendererProps {
  content: ContentObject[]
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  const renderObject = (obj: ContentObject) => {
    switch (obj.type) {
      case 'text':
        return (
          <div
            key={obj.id}
            className="text-content mb-6"
            style={{
              fontSize: `${obj.styling?.fontSize || 16}px`,
              fontWeight: obj.styling?.fontWeight || 'normal',
              color: obj.styling?.color || '#000000',
              textAlign: obj.styling?.alignment || 'left',
              padding: `${obj.styling?.padding?.top || 0}px ${obj.styling?.padding?.right || 0}px ${obj.styling?.padding?.bottom || 0}px ${obj.styling?.padding?.left || 0}px`,
            }}
            dangerouslySetInnerHTML={{ __html: obj.content || '' }}
          />
        )

      case 'gallery':
        const responsive = obj.responsive || {
          desktop: { columns: 3, gap: 16 },
          tablet: { columns: 2, gap: 12 },
          mobile: { columns: 1, gap: 8 },
        }

        return (
          <div key={obj.id} className="gallery-content mb-6">
            {obj.text && obj.textPosition && (
              <div className={`flex flex-col ${obj.textPosition === 'left' || obj.textPosition === 'right' ? 'md:flex-row' : ''} gap-6`}>
                {(obj.textPosition === 'left' || obj.textPosition === 'top') && (
                  <div className="flex-1">
                    <p>{obj.text}</p>
                  </div>
                )}
                
                <div className="flex-1">
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${responsive.desktop.columns}, 1fr)`,
                      gap: `${responsive.desktop.gap}px`,
                    }}
                  >
                    {obj.images.map((image, idx) => (
                      <div key={idx} className="overflow-hidden rounded-lg">
                        <img
                          src={image.url}
                          alt={image.alt || ''}
                          className="w-full h-full object-cover"
                        />
                        {image.caption && (
                          <p className="text-sm text-gray-600 mt-2">{image.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {(obj.textPosition === 'right' || obj.textPosition === 'bottom') && (
                  <div className="flex-1">
                    <p>{obj.text}</p>
                  </div>
                )}
              </div>
            )}
            
            {!obj.text && (
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${responsive.desktop.columns}, 1fr)`,
                  gap: `${responsive.desktop.gap}px`,
                }}
              >
                {obj.images.map((image, idx) => (
                  <div key={idx} className="overflow-hidden rounded-lg">
                    <img
                      src={image.url}
                      alt={image.alt || ''}
                      className="w-full h-full object-cover"
                    />
                    {image.caption && (
                      <p className="text-sm text-gray-600 mt-2">{image.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'video':
        return (
          <div key={obj.id} className="video-content mb-6">
            <video
              src={obj.url}
              poster={obj.poster}
              controls={obj.controls}
              autoPlay={obj.autoplay}
              loop={obj.loop}
              muted={obj.muted}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )

      case 'youtube':
        const youtubeUrl = `https://www.youtube.com/embed/${obj.videoId}${
          obj.autoplay ? '?autoplay=1' : ''
        }${obj.startTime ? `&start=${obj.startTime}` : ''}${
          !obj.controls ? '&controls=0' : ''
        }`

        return (
          <div key={obj.id} className="youtube-content mb-6">
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
              <iframe
                src={youtubeUrl}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )

      case 'embed':
        return (
          <div
            key={obj.id}
            className="embed-content mb-6"
            style={{
              width: obj.width ? `${obj.width}px` : '100%',
              height: obj.height ? `${obj.height}px` : 'auto',
            }}
            dangerouslySetInnerHTML={{ __html: obj.embedCode }}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="content-renderer">
      {content.map((obj) => renderObject(obj))}
    </div>
  )
}
