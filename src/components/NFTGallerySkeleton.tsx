import { Skeleton } from "@/components/ui/skeleton";

export default function NFTGallerySkeleton({ viewMode }: { viewMode: string }) {
  const getGridClasses = () => {
    switch (viewMode) {
      case "large":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4";
      case "small":
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3";
      case "list":
        return "grid-cols-1 gap-2";
      default:
        return "";
    }
  };

  return (
    <div className="p-4 mt-10">
      {/* Top section skeleton */}
      <div className="flex justify-between items-center mb-6">
        {/* View mode buttons skeleton */}
        <div className="flex space-x-2">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-9 w-9 rounded-md" />
          ))}
        </div>

        {/* Search bar skeleton */}
        <div className="flex items-center w-1/2">
          <Skeleton className="w-full h-10 rounded-r-none" />
          <Skeleton className="h-10 w-10 rounded-l-none" />
        </div>

        {/* Mint button skeleton */}
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* Accordion items skeleton */}
      <div className="space-y-4">
        {[...Array(2)].map((_, index) => (
          <div key={index}>
            <Skeleton className="h-8 w-1/4 mb-2 rounded-md" />
            <div className={`grid ${getGridClasses()}`}>
              {[...Array(5)].map((_, index) => (
                <div key={index} className="overflow-hidden">
                  <Skeleton className="w-full pt-[110%] rounded-lg" />
                  <div className="p-4 h-[90px] space-y-2">
                    <Skeleton className="h-6 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
