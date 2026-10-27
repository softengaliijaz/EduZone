import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Plus, RotateCw } from "lucide-react";
import { getUploadUrl } from "../../utils/constants";

const AdminDashboardBlogs = ({ blogs = [], loading, error, onRetry }) => (
  <section className="admin-panel" aria-labelledby="admin-articles-title">
    <header className="admin-panel__header">
      <div>
        <h2 id="admin-articles-title">Recent articles</h2>
        <p>Latest content updates</p>
      </div>
      <Link className="admin-panel__header-link" to="/admin/blog/get-all-blogs">Manage all <ArrowRight size={15} aria-hidden="true" /></Link>
    </header>

    {loading ? (
      <div className="admin-panel__state" role="status">Loading articles…</div>
    ) : error ? (
      <div className="admin-panel__state" role="alert"><p>{error}</p><button className="btn btn-secondary btn-sm" type="button" onClick={onRetry}><RotateCw size={15} aria-hidden="true" /> Retry</button></div>
    ) : blogs.length === 0 ? (
      <div className="admin-panel__state">
        <span className="admin-panel__empty-icon"><FileText size={19} aria-hidden="true" /></span>
        <strong>No articles yet</strong>
        <p>Published articles will appear here.</p>
        <Link className="btn btn-secondary btn-sm" to="/admin/blog/add-blog"><Plus size={15} aria-hidden="true" /> Write an article</Link>
      </div>
    ) : (
      <div className="admin-list">
        {blogs.slice(0, 4).map((blog) => {
          const rawDate = blog.publish_date || blog.createdAt;
          const date = rawDate ? new Date(rawDate) : null;
          const imageUrl = blog.imageUrl || getUploadUrl(blog.image);
          return (
            <article className="admin-list-row admin-article-row" key={blog._id}>
              <span className="admin-article-row__image">
                {imageUrl ? <img src={imageUrl} alt="" loading="lazy" /> : <FileText size={17} aria-hidden="true" />}
              </span>
              <div className="admin-list-row__main">
                <strong>{blog.title || "Untitled article"}</strong>
                <span>{date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : "Date unavailable"}{blog.author?.name ? ` · ${blog.author.name}` : ""}</span>
              </div>
              <Link className="admin-list-row__action" to={`/admin/blog/update-blog/${blog._id}`} aria-label={`Edit ${blog.title || "article"}`}><ArrowRight size={16} aria-hidden="true" /></Link>
            </article>
          );
        })}
      </div>
    )}
  </section>
);

export default AdminDashboardBlogs;
