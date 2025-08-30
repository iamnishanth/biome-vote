import { ExternalLink, ThumbsDown, ThumbsUp } from "lucide-react";
import type { Id } from "../../convex/_generated/dataModel";
import { USERS } from "../types/user";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface RuleCardProps {
  rule: {
    _id: Id<"rules">;
    name: string;
    description: string;
    category: string;
    url: string;
    isRecommended: boolean;
    upVotes: number;
    downVotes: number;
    totalScore: number;
    userVotes: Array<{
      userId: string;
      voteType: "up" | "down";
    }>;
  };
  currentUser: string;
  onVote: (ruleId: Id<"rules">, voteType: "up" | "down") => void;
  onRemoveVote: (ruleId: Id<"rules">) => void;
}

export function RuleCard({
  rule,
  currentUser,
  onVote,
  onRemoveVote,
}: RuleCardProps) {
  const currentUserVote = rule.userVotes.find(
    (vote) => vote.userId === currentUser
  );

  const handleVote = (voteType: "up" | "down") => {
    if (currentUserVote?.voteType === voteType) {
      // Remove vote if clicking the same vote type
      onRemoveVote(rule._id);
    } else {
      // Add or change vote
      onVote(rule._id, voteType);
    }
  };

  const upVoters = rule.userVotes.filter((vote) => vote.voteType === "up");
  const downVoters = rule.userVotes.filter((vote) => vote.voteType === "down");

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold leading-tight break-all">
            {rule.name}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {rule.isRecommended && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 shrink-0"
            >
              Recommended
            </Badge>
          )}
          <Badge variant="outline" className="w-fit">
            {rule.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {rule.description}
        </p>

        <div className="mt-auto space-y-4">
          <a
            href={rule.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Read more <ExternalLink className="ml-1 h-3 w-3" />
          </a>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant={
                  currentUserVote?.voteType === "up" ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleVote("up")}
                className="flex items-center space-x-1"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{rule.upVotes}</span>
              </Button>

              <Button
                variant={
                  currentUserVote?.voteType === "down"
                    ? "destructive"
                    : "outline"
                }
                size="sm"
                onClick={() => handleVote("down")}
                className="flex items-center space-x-1"
              >
                <ThumbsDown className="h-4 w-4" />
                <span>{rule.downVotes}</span>
              </Button>
            </div>

            <div className="flex items-center space-x-1">
              <span
                className={`text-sm font-medium ${
                  rule.totalScore > 0
                    ? "text-green-600"
                    : rule.totalScore < 0
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                {rule.totalScore > 0 ? "+" : ""}
                {rule.totalScore}
              </span>
            </div>
          </div>

          {(upVoters.length > 0 || downVoters.length > 0) && (
            <div className="space-y-2 pt-2 border-t">
              {upVoters.length > 0 && (
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="h-3 w-3 text-green-600" />
                  <div className="flex space-x-1">
                    {upVoters.map((vote) => {
                      const user = USERS.find((u) => u.name === vote.userId);
                      return user ? (
                        <Avatar key={vote.userId} className="h-5 w-5">
                          <AvatarFallback className="text-xs">
                            {user.emoji}
                          </AvatarFallback>
                        </Avatar>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {downVoters.length > 0 && (
                <div className="flex items-center space-x-2">
                  <ThumbsDown className="h-3 w-3 text-red-600" />
                  <div className="flex space-x-1">
                    {downVoters.map((vote) => {
                      const user = USERS.find((u) => u.name === vote.userId);
                      return user ? (
                        <Avatar key={vote.userId} className="h-5 w-5">
                          <AvatarFallback className="text-xs">
                            {user.emoji}
                          </AvatarFallback>
                        </Avatar>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
