type ImageProps = {
	alt: string
}

const Image = ({ alt }: ImageProps) => <span role='img' aria-label={alt} />

export default Image
