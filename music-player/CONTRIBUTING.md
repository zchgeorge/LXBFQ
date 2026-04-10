# Contributing to OpenClaw Music Player

Thank you for your interest in contributing to OpenClaw Music Player! This document provides guidelines and steps for contributing.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- Git
- A GitHub account

### Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/openclaw-music-player.git
   cd openclaw-music-player
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## 📋 Contribution Guidelines

### Code Style
- Use ES6+ JavaScript features
- Follow existing code formatting
- Add comments for complex logic
- Write meaningful commit messages

### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
```
feat: add new feature
fix: fix bug
docs: update documentation
style: code formatting
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes
3. Add or update tests if applicable
4. Update documentation
5. Ensure all tests pass
6. Submit a pull request

## 🐛 Reporting Bugs

### Before Submitting a Bug Report
1. Check if the bug has already been reported
2. Update to the latest version
3. Check the documentation

### How to Submit a Good Bug Report
Create an issue with:
1. **Clear title** - Brief description
2. **Detailed description** - What happened vs expected
3. **Steps to reproduce** - Step-by-step instructions
4. **Environment** - OS, Browser, Node.js version
5. **Screenshots** - If applicable
6. **Code examples** - If applicable

## 💡 Feature Requests

### Before Submitting a Feature Request
1. Check if the feature already exists
2. Check if it aligns with project goals

### How to Submit a Feature Request
Create an issue with:
1. **Clear title** - "Feature: [feature name]"
2. **Problem statement** - What problem does this solve?
3. **Proposed solution** - How should it work?
4. **Alternatives considered** - Other approaches
5. **Additional context** - Screenshots, mockups, etc.

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- tests/server.test.js
```

### Writing Tests
- Write unit tests for new features
- Ensure test coverage doesn't decrease
- Test edge cases and error conditions

## 📖 Documentation

### Updating Documentation
- Update README.md for user-facing changes
- Update code comments for API changes
- Add JSDoc comments for new functions

### Documentation Standards
- Use clear, concise language
- Include code examples
- Keep documentation up-to-date with code

## 🏗️ Project Structure

```
openclaw-music-player/
├── src/              # Server source code
├── public/           # Frontend files
├── tests/           # Test files
├── uploads/         # Uploaded files (gitignored)
├── package.json     # Dependencies
├── README.md        # Documentation
└── CONTRIBUTING.md  # This file
```

## 🎨 Design Guidelines

### UI/UX
- Follow existing design patterns
- Ensure accessibility (ARIA labels, keyboard navigation)
- Maintain responsive design
- Use consistent color scheme

### Audio Handling
- Support common audio formats
- Handle errors gracefully
- Provide user feedback

## 🔒 Security

### Security Guidelines
- Never commit secrets or API keys
- Validate user input
- Sanitize file uploads
- Follow security best practices

### Reporting Security Issues
Please report security issues privately via email to the maintainers.

## 📝 Code Review Process

### What Reviewers Look For
- Code quality and readability
- Test coverage
- Documentation updates
- Performance considerations
- Security implications

### Review Expectations
- Be respectful and constructive
- Provide clear feedback
- Suggest improvements
- Acknowledge good work

## 🏆 Recognition

Contributors will be:
- Listed in the README.md
- Acknowledged in release notes
- Given credit for their work

## ❓ Questions?

- Check the README.md first
- Search existing issues
- Ask in discussions (if enabled)
- Contact maintainers if needed

---

Thank you for contributing to OpenClaw Music Player! 🎵