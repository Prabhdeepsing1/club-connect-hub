import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertTriangle, FileCode, GitCommit, Link as LinkIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PRAssistant = () => {
  const [inputMethod, setInputMethod] = useState("diff");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [prDiff, setPrDiff] = useState("");
  const [prUrl, setPrUrl] = useState("");

  // Mock analysis results
  const mockResults = {
    score: 75,
    grade: "Good",
    recommendation: "Ready to Submit with Minor Improvements",
    checks: [
      {
        name: "Linting",
        status: "passed",
        details: "No linting errors found. Code follows style guidelines.",
      },
      {
        name: "Code Formatting",
        status: "passed",
        details: "Code is properly formatted and indented.",
      },
      {
        name: "Commit Messages",
        status: "warning",
        details: "2 commit messages don't follow conventional commit format.",
      },
      {
        name: "File Structure",
        status: "failed",
        details: "Test files should be in __tests__ directory, not tests/.",
      },
      {
        name: "Documentation",
        status: "warning",
        details: "Consider adding JSDoc comments to exported functions.",
      },
      {
        name: "Link Validation",
        status: "passed",
        details: "All URLs in PR description are valid.",
      },
    ],
    suggestions: [
      {
        priority: "critical",
        title: "Move test files to correct directory",
        description: "Test files should follow the project structure convention.",
        steps: [
          "Create __tests__ directory if it doesn't exist",
          "Move all *.test.js files from tests/ to __tests__/",
          "Update import paths if necessary",
          "Commit the changes",
        ],
      },
      {
        priority: "important",
        title: "Update commit messages",
        description: "Follow conventional commit format for better history.",
        steps: [
          "Use format: type(scope): description",
          "Valid types: feat, fix, docs, style, refactor, test, chore",
          "Example: feat(auth): add login functionality",
          "Use git rebase -i to edit commit messages if needed",
        ],
      },
      {
        priority: "minor",
        title: "Add function documentation",
        description: "JSDoc comments improve code maintainability.",
        steps: [
          "Add /** */ comments above exported functions",
          "Include @param for each parameter",
          "Include @returns for return values",
          "Example provided in documentation",
        ],
      },
    ],
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary"> = {
      critical: "destructive",
      important: "default",
      minor: "secondary",
    };
    return <Badge variant={variants[priority]}>{priority}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              PR Quality Assistant
            </h1>
            <p className="text-lg text-muted-foreground">
              Analyze and improve your pull request before submission
            </p>
          </div>
        </div>
      </section>

      {/* Input Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-4xl">
            <CardHeader>
              <CardTitle>Submit Your PR for Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={inputMethod} onValueChange={setInputMethod}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="diff">
                    <FileCode className="mr-2 h-4 w-4" />
                    Paste Diff
                  </TabsTrigger>
                  <TabsTrigger value="url">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    PR URL
                  </TabsTrigger>
                  <TabsTrigger value="manual">
                    <GitCommit className="mr-2 h-4 w-4" />
                    Manual Input
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="diff" className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Paste your git diff output
                    </label>
                    <Textarea
                      placeholder="Paste output of: git diff origin/main...your-branch"
                      rows={12}
                      value={prDiff}
                      onChange={(e) => setPrDiff(e.target.value)}
                      className="font-mono text-sm"
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Run <code className="rounded bg-muted px-1 py-0.5">git diff</code> in your
                      repository and paste the output here
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      GitHub Pull Request URL
                    </label>
                    <Input
                      placeholder="https://github.com/owner/repo/pull/123"
                      value={prUrl}
                      onChange={(e) => setPrUrl(e.target.value)}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      We'll automatically fetch the PR details from GitHub
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="manual" className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      PR Title
                    </label>
                    <Input placeholder="Add authentication feature" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Description
                    </label>
                    <Textarea rows={4} placeholder="Describe your changes..." />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Commit Messages (one per line)
                    </label>
                    <Textarea rows={6} placeholder="feat: add login page&#10;fix: resolve authentication bug&#10;docs: update README" />
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Check Quality"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      {hasAnalyzed && (
        <section className="border-t border-border py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl space-y-8">
              {/* Score Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`mb-2 text-6xl font-bold ${getScoreColor(mockResults.score)}`}>
                      {mockResults.score}
                    </div>
                    <div className="mb-4 text-xl font-semibold text-foreground">
                      {mockResults.grade}
                    </div>
                    <Badge variant="default" className="mb-6">
                      {mockResults.recommendation}
                    </Badge>
                    <Progress value={mockResults.score} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Checks */}
              <Card>
                <CardHeader>
                  <CardTitle>Quality Checks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockResults.checks.map((check) => (
                      <div
                        key={check.name}
                        className="flex items-start gap-4 rounded-lg border border-border p-4"
                      >
                        {getStatusIcon(check.status)}
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{check.name}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">{check.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle>Improvement Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockResults.suggestions.map((suggestion, index) => (
                      <div key={index} className="rounded-lg border border-border p-6">
                        <div className="mb-3 flex items-start justify-between">
                          <h4 className="font-semibold text-foreground">{suggestion.title}</h4>
                          {getPriorityBadge(suggestion.priority)}
                        </div>
                        <p className="mb-4 text-sm text-muted-foreground">
                          {suggestion.description}
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Steps to fix:</p>
                          <ol className="ml-4 list-decimal space-y-1 text-sm text-muted-foreground">
                            {suggestion.steps.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">
                  Download Report
                </Button>
                <Button className="flex-1" onClick={() => setHasAnalyzed(false)}>
                  Analyze Another PR
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default PRAssistant;
