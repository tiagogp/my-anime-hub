import Image from 'next/image';

type BackgroundImageProps = {
  src: string
  alt: string
}

export const BackgroundImage = async ({ src, alt }: BackgroundImageProps) => (
  <Image
    src={src}
    alt={alt}
    width={224}
    height={300}
    className="absolute top-0 -z-20 h-svh w-full object-cover opacity-50 blur-md"
  />
)

export default BackgroundImage;
