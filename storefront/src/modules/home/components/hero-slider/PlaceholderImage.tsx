const placeholderContent = [
  {
    title: "Premium Spices",
    subtitle: "From Around the World",
    bgColor: "#955220",
    pattern: "radial-gradient(circle at 25% 25%, #f4e08e 1%, transparent 8%, transparent 100%)"
  },
  {
    title: "Artisanal Blends",
    subtitle: "Crafted with Care",
    bgColor: "#e4d897",
    pattern: "linear-gradient(45deg, #955220 25%, transparent 25%, transparent 75%, #955220 75%, #955220)"
  },
  {
    title: "Fresh & Authentic",
    subtitle: "Direct from Source",
    bgColor: "#c5c9aa",
    pattern: "repeating-linear-gradient(-45deg, #f4e08e, #f4e08e 5px, transparent 5px, transparent 25px)"
  }
]

export default function PlaceholderImage({ index }: { index: number }) {
  const content = placeholderContent[index]
  
  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center"
      style={{
        backgroundColor: content.bgColor,
        backgroundImage: content.pattern,
        backgroundSize: index === 1 ? "50px 50px" : "100px 100px"
      }}
    >
      <div className="text-center">
        <h2 className="text-white text-6xl font-bold mb-4 drop-shadow-lg">
          {content.title}
        </h2>
        <p className="text-brand-secondary text-2xl font-light">
          {content.subtitle}
        </p>
      </div>
    </div>
  )
}