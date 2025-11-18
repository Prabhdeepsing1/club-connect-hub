import { supabase } from '../config/supabaseClient.js'

// Helper function to calculate PR score
function calculatePRScore(analysis) {
    let score = 100
    
    // Deduct points for issues
    analysis.issues.forEach(issue => {
        if (issue.severity === 'critical') score -= 10
        else if (issue.severity === 'high') score -= 5
        else if (issue.severity === 'medium') score -= 3
        else score -= 1
    })
    
    return Math.max(0, Math.min(100, score))
}

// Helper function to determine grade
function getGrade(score) {
    if (score >= 90) return 'Excellent'
    if (score >= 75) return 'Good'
    if (score >= 60) return 'Fair'
    if (score >= 40) return 'Needs Improvement'
    return 'Poor'
}

// Helper function to get recommendation
function getRecommendation(score, issues) {
    const criticalIssues = issues.filter(i => i.severity === 'critical').length
    const highIssues = issues.filter(i => i.severity === 'high').length
    
    if (criticalIssues > 0) return 'Fix Critical Issues Before Submitting'
    if (highIssues > 2) return 'Address High Priority Issues'
    if (score >= 80) return 'Ready to Submit'
    if (score >= 60) return 'Review and Improve'
    return 'Significant Changes Needed'
}

// Analyze diff content
function analyzeDiff(diff) {
    const issues = []
    const suggestions = []
    
    // Check for large diffs
    const lines = diff.split('\n').length
    if (lines > 500) {
        suggestions.push({
            priority: 'important',
            title: 'Large PR detected',
            advice: 'Consider breaking this PR into smaller, focused changes'
        })
    }
    
    // Check for console.log statements
    if (diff.includes('console.log')) {
        issues.push({
            category: 'code-quality',
            severity: 'medium',
            title: 'Debug statements detected',
            description: 'Remove console.log statements before submitting',
            fix: 'Remove or replace with proper logging'
        })
    }
    
    // Check for TODO/FIXME comments
    if (diff.match(/TODO|FIXME/i)) {
        suggestions.push({
            priority: 'medium',
            title: 'Incomplete work detected',
            advice: 'Address TODO/FIXME comments before submission'
        })
    }
    
    return { issues, suggestions }
}

// Analyze commit messages
function analyzeCommits(commits) {
    const issues = []
    const suggestions = []
    
    const conventionalCommitPattern = /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+/
    
    commits.forEach((commit, index) => {
        if (!conventionalCommitPattern.test(commit)) {
            suggestions.push({
                priority: 'important',
                title: `Commit ${index + 1}: Non-conventional format`,
                advice: 'Use conventional commit format (e.g., "feat: add login")'
            })
        }
        
        if (commit.length < 10) {
            issues.push({
                category: 'commit-message',
                severity: 'medium',
                title: `Commit ${index + 1}: Message too short`,
                description: 'Commit messages should be descriptive',
                fix: 'Provide a clear, detailed commit message'
            })
        }
    })
    
    return { issues, suggestions }
}

// Analyze PR title and description
function analyzeMetadata(title, description) {
    const issues = []
    const suggestions = []
    
    // Check title
    if (!title || title.length < 10) {
        issues.push({
            category: 'metadata',
            severity: 'high',
            title: 'PR title too short',
            description: 'Title should clearly describe the changes',
            fix: 'Provide a descriptive title (minimum 10 characters)'
        })
    }
    
    if (title && title.length > 100) {
        suggestions.push({
            priority: 'low',
            title: 'PR title too long',
            advice: 'Keep title concise (under 100 characters)'
        })
    }
    
    // Check description
    if (!description || description.length < 20) {
        issues.push({
            category: 'metadata',
            severity: 'high',
            title: 'Missing or insufficient description',
            description: 'PR should include a detailed description of changes',
            fix: 'Add a comprehensive description explaining what, why, and how'
        })
    }
    
    return { issues, suggestions }
}

// Analyze changed files
function analyzeFiles(files) {
    const issues = []
    const suggestions = []
    
    if (files.length > 20) {
        suggestions.push({
            priority: 'important',
            title: 'Too many files changed',
            advice: 'Consider splitting into multiple focused PRs'
        })
    }
    
    // Check for mixed concerns
    const hasTests = files.some(f => f.includes('.test.') || f.includes('.spec.'))
    const hasSrc = files.some(f => f.includes('src/') || f.includes('lib/'))
    const hasDocs = files.some(f => f.includes('.md'))
    
    const concernCount = [hasTests, hasSrc, hasDocs].filter(Boolean).length
    if (concernCount > 1 && files.length > 10) {
        suggestions.push({
            priority: 'medium',
            title: 'Mixed concerns detected',
            advice: 'Consider separating code, tests, and documentation changes'
        })
    }
    
    return { issues, suggestions }
}

export async function analyzePR(req, res) {
    try {
        const { inputType, data } = req.body
        
        if (!inputType || !data) {
            return res.status(400).json({ error: 'inputType and data are required' })
        }
        
        const validInputTypes = ['diff', 'url', 'manual']
        if (!validInputTypes.includes(inputType)) {
            return res.status(400).json({ error: 'Invalid inputType. Must be: diff, url, or manual' })
        }
        
        let allIssues = []
        let allSuggestions = []
        
        // Analyze based on input type
        switch (inputType) {
            case 'diff':
                if (!data.diff) {
                    return res.status(400).json({ error: 'diff is required for inputType "diff"' })
                }
                const diffAnalysis = analyzeDiff(data.diff)
                allIssues.push(...diffAnalysis.issues)
                allSuggestions.push(...diffAnalysis.suggestions)
                break
                
            case 'url':
                if (!data.url) {
                    return res.status(400).json({ error: 'url is required for inputType "url"' })
                }
                // Note: In production, you would fetch PR data from GitHub API
                allSuggestions.push({
                    priority: 'info',
                    title: 'URL analysis',
                    advice: 'Fetching PR data from GitHub API (feature pending)'
                })
                break
                
            case 'manual':
                if (!data.title) {
                    return res.status(400).json({ error: 'title is required for inputType "manual"' })
                }
                
                // Analyze metadata
                const metaAnalysis = analyzeMetadata(data.title, data.description)
                allIssues.push(...metaAnalysis.issues)
                allSuggestions.push(...metaAnalysis.suggestions)
                
                // Analyze commits if provided
                if (data.commits && Array.isArray(data.commits)) {
                    const commitAnalysis = analyzeCommits(data.commits)
                    allIssues.push(...commitAnalysis.issues)
                    allSuggestions.push(...commitAnalysis.suggestions)
                }
                
                // Analyze files if provided
                if (data.changedFiles && Array.isArray(data.changedFiles)) {
                    const fileAnalysis = analyzeFiles(data.changedFiles)
                    allIssues.push(...fileAnalysis.issues)
                    allSuggestions.push(...fileAnalysis.suggestions)
                }
                break
        }
        
        // Calculate overall metrics
        const totalChecks = 15
        const passedChecks = totalChecks - allIssues.filter(i => i.severity === 'critical' || i.severity === 'high').length
        const overallScore = calculatePRScore({ issues: allIssues })
        const grade = getGrade(overallScore)
        const recommendation = getRecommendation(overallScore, allIssues)
        
        // Sort issues by severity
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        allIssues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
        
        // Sort suggestions by priority
        const priorityOrder = { important: 0, medium: 1, low: 2, info: 3 }
        allSuggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
        
        res.json({
            overallScore,
            grade,
            recommendation,
            passedChecks,
            totalChecks,
            issues: allIssues,
            suggestions: allSuggestions,
            analysis: {
                inputType,
                timestamp: new Date().toISOString(),
                userId: req.user.id
            }
        })
        
    } catch (err) {
        console.error('PR analysis error:', err.message)
        res.status(500).json({ error: `Failed to analyze PR. ${err.message}` })
    }
}