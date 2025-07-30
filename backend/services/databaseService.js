import { supabase } from '../config/database.js';

export class DatabaseService {
  constructor() {
    this.client = supabase;
  }

  // Basic database operations
  async query(table, options = {}) {
    if (!this.client) {
      throw new Error('Database not configured');
    }

    try {
      let query = this.client.from(table);
      
      if (options.select) {
        query = query.select(options.select);
      } else {
        query = query.select('*');
      }

      if (options.where) {
        Object.entries(options.where).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      if (options.order) {
        query = query.order(options.order.column, { 
          ascending: options.order.ascending || false 
        });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      
      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async insert(table, data) {
    if (!this.client) {
      throw new Error('Database not configured');
    }

    try {
      const { data: result, error } = await this.client
        .from(table)
        .insert(data)
        .select();

      if (error) {
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Database insert error:', error);
      throw error;
    }
  }

  async update(table, id, data) {
    if (!this.client) {
      throw new Error('Database not configured');
    }

    try {
      const { data: result, error } = await this.client
        .from(table)
        .update(data)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  }

  async delete(table, id) {
    if (!this.client) {
      throw new Error('Database not configured');
    }

    try {
      const { error } = await this.client
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Database delete error:', error);
      throw error;
    }
  }

  async healthCheck() {
    if (!this.client) {
      return { connected: false, error: 'Database not configured' };
    }

    try {
      // Simple query to test connection
      const { data, error } = await this.client
        .from('umbler_contacts')
        .select('id')
        .limit(1);

      if (error && error.code !== 'PGRST116') { // PGRST116 = table not found, which is okay
        throw error;
      }

      return { connected: true };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }
}