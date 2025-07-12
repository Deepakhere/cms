const generateHTMLContent = (formData) => {
  const {
    title,
    subtext,
    bodyContent,
    showAuthor,
    authorName,
    files,
    createdBy,
    publishDate,
    publishTime,
  } = formData;

  // Format the publish date if available
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get the author display name
  const getAuthorName = () => {
    if (authorName && authorName.trim()) {
      return authorName;
    }
    return createdBy || "Anonymous";
  };

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || "Untitled Page"}</title>
    <meta name="description" content="${subtext || ""}">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: #ffffff;
            min-height: 100vh;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }

        .page-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 60px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }

        .header-content {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .page-title {
            font-size: 3rem;
            font-weight: 700;
            color: white;
            margin-bottom: 16px;
            line-height: 1.2;
        }

        .page-subtitle {
            font-size: 1.4rem;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 300;
            margin-bottom: 0;
        }

        .header-profile {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-left: 40px;
        }

        .author-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
        }

        .author-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .author-avatar-placeholder {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 24px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .author-details {
            text-align: center;
        }

        .author-name {
            font-weight: 600;
            color: white;
            font-size: 16px;
            margin-bottom: 4px;
        }

        .publish-date {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
        }

        .main-container {
            display: flex;
            gap: 40px;
            padding: 40px;
            min-height: 600px;
        }

        .content-area {
            flex: 1;
            max-width: 65%;
        }

        .sidebar {
            width: 35%;
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 30px;
            height: fit-content;
            position: sticky;
            top: 20px;
        }

        .page-content {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #2d3748;
            background-color: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .page-content h1,
        .page-content h2,
        .page-content h3,
        .page-content h4,
        .page-content h5,
        .page-content h6 {
            margin: 30px 0 15px 0;
            color: #1a202c;
        }

        .page-content p {
            margin-bottom: 20px;
        }

        .page-content ul,
        .page-content ol {
            margin: 20px 0;
            padding-left: 30px;
        }

        .page-content li {
            margin-bottom: 8px;
        }

        .page-content a {
            color: #4f46e5;
            text-decoration: none;
        }

        .page-content a:hover {
            text-decoration: underline;
        }

        .page-content blockquote {
            border-left: 4px solid #4f46e5;
            padding-left: 20px;
            margin: 20px 0;
            font-style: italic;
            color: #4a5568;
        }

        .page-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 20px 0;
            // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .sidebar-section {
            margin-bottom: 30px;
        }

        .sidebar-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 8px;
        }

        .thumbnail-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
        }

        .thumbnail-image {
            width: 100%;
            height: 120px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 6px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 500;
        }

        .thumbnail-title {
            font-size: 14px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
        }

        .thumbnail-description {
            font-size: 12px;
            color: #718096;
            line-height: 1.4;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .stat-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .stat-number {
            font-size: 1.5rem;
            font-weight: 700;
            color: #4f46e5;
        }

        .stat-label {
            font-size: 12px;
            color: #718096;
            margin-top: 4px;
        }

        .page-footer {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 1px solid #e1e5e9;
            text-align: center;
            color: #718096;
            font-size: 14px;
        }

        @media (max-width: 768px) {
            .page-header {
                flex-direction: column;
                text-align: center;
                padding: 40px 20px;
            }

            .header-profile {
                margin-left: 0;
                margin-top: 30px;
            }

            .page-title {
                font-size: 2.2rem;
            }

            .page-subtitle {
                font-size: 1.2rem;
            }

            .main-container {
                flex-direction: column;
                padding: 20px;
                gap: 20px;
            }

            .content-area {
                max-width: 100%;
            }

            .sidebar {
                width: 100%;
                position: static;
            }

            .page-content {
                font-size: 1rem;
                padding: 20px;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="page-header">
            <div class="header-content">
                <h1 class="page-title">${title || "Untitled Page"}</h1>
                ${subtext ? `<p class="page-subtitle">${subtext}</p>` : ""}
            </div>

            ${
              showAuthor
                ? `
            <div class="header-profile">
                <div class="author-info">
                    ${
                      files
                        ? `<img src="${files}" alt="${getAuthorName()}" class="author-avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div class="author-avatar-placeholder" style="display: none;">${getAuthorName()
                           .charAt(0)
                           .toUpperCase()}</div>`
                        : `<div class="author-avatar-placeholder">${getAuthorName()
                            .charAt(0)
                            .toUpperCase()}</div>`
                    }
                    <div class="author-details">
                        <div class="author-name">${getAuthorName()}</div>
                        ${
                          publishDate
                            ? `<div class="publish-date">Published ${formatDate(
                                publishDate
                              )}</div>`
                            : ""
                        }
                    </div>
                </div>
            </div>
            `
                : ""
            }
        </header>

        <div class="main-container">
            <div class="content-area">
                <main class="page-content">
                    ${bodyContent || "<p>No content available.</p>"}
                </main>
            </div>

            <aside class="sidebar">
                <div class="sidebar-section">
                    <h3 class="sidebar-title">Related Content</h3>
                    <div class="thumbnail-card">
                        <div class="thumbnail-image">Featured Article</div>
                        <div class="thumbnail-title">Explore More Topics</div>
                        <div class="thumbnail-description">Discover related articles and insights on similar topics.</div>
                    </div>
                    <div class="thumbnail-card">
                        <div class="thumbnail-image">Latest Updates</div>
                        <div class="thumbnail-title">Stay Updated</div>
                        <div class="thumbnail-description">Get the latest news and updates from our platform.</div>
                    </div>
                </div>

                <div class="sidebar-section">
                    <h3 class="sidebar-title">Quick Stats</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">5</div>
                            <div class="stat-label">Min Read</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">1.2K</div>
                            <div class="stat-label">Views</div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>

        <footer class="page-footer">
            <p>Generated on ${new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
        </footer>
    </div>
</body>
</html>`;

  return htmlTemplate;
};
export default generateHTMLContent;
