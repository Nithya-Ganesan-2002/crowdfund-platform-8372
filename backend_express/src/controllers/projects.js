'use strict';

const { createProject, getProjectById, listProjects, updateProject, deleteProject } = require('../models/project');

class ProjectsController {
  // PUBLIC_INTERFACE
  async create(req, res) {
    /** Create a project owned by the authenticated user. */
    try {
      const owner_id = req.user?.id;
      if (!owner_id) return res.status(401).json({ error: 'Unauthorized' });

      const { title, description, goal_amount, deadline, category } = req.body || {};
      if (!title || !description || !goal_amount) {
        return res.status(400).json({ error: 'title, description, and goal_amount are required' });
      }
      const payload = {
        owner_id,
        title,
        description,
        goal_amount: Number(goal_amount),
        deadline: deadline || null,
        category: category || null,
      };
      const project = await createProject(payload);
      return res.status(201).json({ project });
    } catch (e) {
      console.error('Create project error', e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // PUBLIC_INTERFACE
  async get(req, res) {
    /** Get a project by id. */
    try {
      const { id } = req.params;
      const project = await getProjectById(id);
      if (!project) return res.status(404).json({ error: 'Project not found' });
      return res.status(200).json({ project });
    } catch (e) {
      console.error('Get project error', e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // PUBLIC_INTERFACE
  async list(req, res) {
    /** List projects with optional filters. */
    try {
      const { q, category, owner_id, limit, offset } = req.query;
      const projects = await listProjects({
        q,
        category,
        owner_id,
        limit: limit ? parseInt(limit, 10) : 20,
        offset: offset ? parseInt(offset, 10) : 0,
      });
      return res.status(200).json({ projects });
    } catch (e) {
      console.error('List projects error', e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res) {
    /** Update fields for a project (owner only). */
    try {
      const owner_id = req.user?.id;
      if (!owner_id) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.params;
      const updated = await updateProject(id, owner_id, req.body || {});
      if (!updated) return res.status(404).json({ error: 'Project not found or not owned by user' });
      return res.status(200).json({ project: updated });
    } catch (e) {
      console.error('Update project error', e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // PUBLIC_INTERFACE
  async remove(req, res) {
    /** Delete a project (owner only). */
    try {
      const owner_id = req.user?.id;
      if (!owner_id) return res.status(401).json({ error: 'Unauthorized' });
      const { id } = req.params;
      const del = await deleteProject(id, owner_id);
      if (!del) return res.status(404).json({ error: 'Project not found or not owned by user' });
      return res.status(200).json({ success: true });
    } catch (e) {
      console.error('Delete project error', e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new ProjectsController();
