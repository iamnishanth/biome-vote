import { useMutation, useQuery } from "convex/react";
import { Filter, Search } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Navbar } from "./Navbar";
import { RuleCard } from "./RuleCard";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function RulesPage() {
  const categorySelectId = useId();
  const recommendationSelectId = useId();
  const [searchParams] = useSearchParams();
  const currentUser = searchParams.get("user") || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [recommendedFilter, setRecommendedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "category" | "score">("name");
  const [showFilters, setShowFilters] = useState(false);

  const categories = useQuery(api.rules.getCategories);
  const voteOnRule = useMutation(api.rules.voteOnRule);
  const removeVote = useMutation(api.rules.removeVote);

  const rules = useQuery(api.rules.getAllRules);

  // Filter and sort rules in the frontend
  const filteredRules = useMemo(() => {
    if (!rules) return [];

    let filtered = [...rules];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (rule) =>
          rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rule.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((rule) => rule.category === selectedCategory);
    }

    // Apply recommendation filter
    if (recommendedFilter === "recommended") {
      filtered = filtered.filter((rule) => rule.isRecommended === true);
    } else if (recommendedFilter === "not-recommended") {
      filtered = filtered.filter((rule) => rule.isRecommended === false);
    }

    // Apply sorting
    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category") {
      filtered.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === "score") {
      filtered.sort((a, b) => b.totalScore - a.totalScore);
    }

    return filtered;
  }, [rules, searchTerm, selectedCategory, recommendedFilter, sortBy]);

  const handleVote = async (ruleId: Id<"rules">, voteType: "up" | "down") => {
    await voteOnRule({
      ruleId,
      userId: currentUser,
      voteType,
    });
  };

  const handleRemoveVote = async (ruleId: Id<"rules">) => {
    await removeVote({
      ruleId,
      userId: currentUser,
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setRecommendedFilter("all");
    setSortBy("name");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== "all" ||
    recommendedFilter !== "all" ||
    sortBy !== "name";

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No user selected
          </h2>
          <p className="text-gray-600">
            Please go back and select a user profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
              disabled={categories === undefined}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  Active
                </Badge>
              )}
            </Button>

            <Select
              value={sortBy}
              onValueChange={(value: "name" | "category" | "score") =>
                setSortBy(value)
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="score">Vote Score</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-lg border space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor={categorySelectId}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger id={categorySelectId}>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories === undefined ? (
                        <SelectItem value="loading" disabled>
                          Loading categories...
                        </SelectItem>
                      ) : (
                        categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor={recommendationSelectId}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Recommendation
                  </label>
                  <Select
                    value={recommendedFilter}
                    onValueChange={setRecommendedFilter}
                  >
                    <SelectTrigger id={recommendationSelectId}>
                      <SelectValue placeholder="All rules" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All rules</SelectItem>
                      <SelectItem value="recommended">
                        Recommended only
                      </SelectItem>
                      <SelectItem value="not-recommended">
                        Not recommended
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {rules === undefined
              ? "Loading..."
              : `${filteredRules?.length || 0} rules found`}
          </p>
        </div>

        {/* Loading State */}
        {rules === undefined && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading rules...</span>
            </div>
          </div>
        )}

        {/* Rules Grid */}
        {rules !== undefined && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRules?.map((rule) => (
              <RuleCard
                key={rule._id}
                rule={rule}
                currentUser={currentUser}
                onVote={handleVote}
                onRemoveVote={handleRemoveVote}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {rules !== undefined && filteredRules?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No rules found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
