import React, { useState, useEffect, useRef, useCallback } from "react";
import ProjectCard from "./ProjectCard";
import CategoryTabs from "./CategoryTabs";
import FilterDropdown from "./FilterDropDown";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const RealEstateListings = () => {
  const { filters = "", "*": splat = "" } = useParams();
  const fullFilters = [filters, splat].filter(Boolean).join("/");
  const navigate = useNavigate();
  const location = useLocation();

  const [allProjects, setAllProjects] = useState([]);
  const [category, setCategory] = useState("All");
  const [launchFilter, setLaunchFilter] = useState("All");
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [statusOptions, setStatusOptions] = useState(["All"]);
  const [availableCategories, setAvailableCategories] = useState(["All"]);
  const [locationType, setLocationType] = useState("All"); // New state for Domestic/International
  const [loading, setLoading] = useState(true); // Add loading state

  const observerRef = useRef();
  const perPage = 2;

  // Track if filters were set from URL to avoid URL overwrite
  const [filtersInitialized, setFiltersInitialized] = useState(false);

  // ✅ Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/properties`);
        const formatted = response.data.map((item) => ({
          id: item.id,
          name: item.project_name,
          type: item.type,
          category: item.type,
          launchType: item.status,
          location: item.location,
          bhk: item.configuration,
          area: item.carpet_area,
          possession: item.possession,
          price: item.price_range,
          status: item.status,
          slug: item.slug,
          linkType: item.project_name,
          extraCharges: item.extra_charges,
          image: item.property_images?.[0]?.image_path || null,
          brochure: item.brochure_url,
          layoutPlan: item.layout_plan_url,
          whyToInvest: item.why_to_invest,
          videoUrl: item.video_url,
          videoThumbnail: item.video_thumbnail,
          amenities: item.amenities,
          aboutBuilder: item.about_builder,
          images: item.property_images || [],
          locationType: item.location_type ? item.location_type : (item.location?.toLowerCase() === "domestic" ? "Domestic" : item.location?.toLowerCase() === "international" ? "International" : ""),
        }));

        setAllProjects(formatted);
        
        // Extract unique categories and statuses
        const uniqueCategories = Array.from(new Set(response.data.map(item => item.type))).filter(Boolean);
        setAvailableCategories(["All", ...uniqueCategories]);
        
        const uniqueStatuses = Array.from(new Set(response.data.map(item => item.status))).filter(Boolean);
        setStatusOptions(["All", ...uniqueStatuses]);

      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false); // End loading regardless of success or error
      }
    };

    fetchProjects();
  }, []);



  // Parse filters from URL (robust, only set each filter once, never overwrite)
  useEffect(() => {
    if (availableCategories.length > 1) {
      if (fullFilters) {
        const filterArr = fullFilters.split("/").filter(Boolean);
        let newLocationType = "All";
        let newCategory = "All";
        filterArr.forEach(f => {
          if (newLocationType === "All" && ["domestic", "international"].includes(f.toLowerCase())) {
            newLocationType = f[0].toUpperCase() + f.slice(1).toLowerCase();
          } else if (newCategory === "All" && availableCategories.map(c => c.toLowerCase()).includes(f.toLowerCase())) {
            newCategory = availableCategories.find(c => c.toLowerCase() === f.toLowerCase());
          }
        });
        setLocationType(newLocationType);
        setCategory(newCategory);
        setFiltersInitialized(true);
      } else {
        setLocationType("All");
        setCategory("All");
        setFiltersInitialized(true);
      }
    }
    // eslint-disable-next-line
  }, [fullFilters, availableCategories]);

  // Update URL when locationType or category changes (but not on initial URL parse)
  useEffect(() => {
    if (!filtersInitialized) return;
    if (availableCategories.length > 1) {
      let url = "/real-estate";
      const segments = [];
      if (locationType !== "All") segments.push(locationType.toLowerCase());
      if (
        category !== "All" &&
        category.toLowerCase() !== locationType.toLowerCase() &&
        availableCategories.map(c => c.toLowerCase()).includes(category.toLowerCase())
      ) {
        segments.push(category.toLowerCase());
      }
      if (segments.length) url += "/" + segments.join("/");
      // Only update if the segments in the URL do not match the intended state
      const currentSegments = (filters || "").split("/").filter(Boolean);
      const intendedSegments = segments;
      const segmentsMatch =
        currentSegments.length === intendedSegments.length &&
        currentSegments.every((seg, i) => seg === intendedSegments[i]);
      if (!segmentsMatch) {
        navigate(url, { replace: true });
      }
    }
    // eslint-disable-next-line
  }, [locationType, category, navigate, filters, availableCategories, filtersInitialized]);

  const loadProjects = useCallback(() => {
    const filtered = allProjects.filter((p) => {
      const locationMatch = locationType === "All" || (p.locationType && p.locationType.toLowerCase() === locationType.toLowerCase());
      const categoryMatch = category === "All" || (p.type && p.type.toLowerCase() === category.toLowerCase());
      return locationMatch && categoryMatch && (launchFilter === "All" || p.launchType === launchFilter);
    });
    setVisibleProjects(filtered.slice(0, page * perPage));
  }, [category, launchFilter, page, allProjects, locationType]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) observer.observe(currentObserver);

    return () => {
      if (currentObserver) observer.unobserve(currentObserver);
    };
  }, [visibleProjects]);

  useEffect(() => {
    setPage(1);
  }, [category, launchFilter, locationType]);

  // SEO dynamic title/description
  const seoParts = [];
  if (locationType !== "All") seoParts.push(locationType);
  if (category !== "All") seoParts.push(category);
  const seoTitle = seoParts.length ? `${seoParts.join(" ")} Properties | MyInvestoryy` : "Real Estate Listings | MyInvestoryy";
  const seoDesc = seoParts.length ? `Explore the best ${seoParts.join(" ").toLowerCase()} real estate investment opportunities.` : "Explore the best real estate investment opportunities. Filter by category, status, and location (Domestic/International).";

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDesc} />
        <meta name="twitter:image" content="/og-image.png" />
      </Helmet>
      <div className="bg-black text-white min-h-screen">

        <div className="max-w-7xl mx-auto">
          {/* New Domestic/International Filter Tabs */}
          <div className="flex justify-center mb-4">
            {['All', 'Domestic', 'International'].map((type) => (
              <button
                key={type}
                onClick={() => setLocationType(type)}
                className={`px-4 py-2 mx-1 rounded-full font-semibold transition-colors duration-200 ${locationType === type ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
              >
                {type}
              </button>
            ))}
          </div>
          <CategoryTabs selected={category} onSelect={setCategory} categories={availableCategories} />
          <div className="text-center my-3 sm:my-4 lg:my-5">
            <FilterDropdown selected={launchFilter} onChange={setLaunchFilter} options={statusOptions} />
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-[60px] mt-6 sm:mt-8 lg:mt-10 w-full">
              {loading ? (
                <div className="col-span-full text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-6"></div>
                    <p className="text-xl text-gray-400">Loading properties...</p>
                    <p className="text-sm text-gray-500 mt-2">Please wait while we are finding latest real estate properties.</p>
                  </div>
                </div>
              ) : visibleProjects.length === 0 ? (
                <div className="col-span-full text-center py-10">
                  <p className="text-xl text-gray-400">No properties found matching your current filters.</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your filters to see more properties.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {visibleProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.4 }}
                      className="w-full"
                    >
                      <ProjectCard data={project} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          <div ref={observerRef} className="h-10 mt-8 lg:mt-10" />
        </div>
      </div>
    </>
  );
};

export default RealEstateListings;