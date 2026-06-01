import { Injectable } from '@nestjs/common';
import { getSupabase } from '../Supabase/supabase.client';
import { redis } from '../redis/redis.client';

@Injectable()
export class ListingsService {
  async createListing(body: any, files: Express.Multer.File[]) {
    const supabase = getSupabase();

    const { game, heroicEmblem, level, price, description } = body;

    const imageUrls: string[] = [];

    for (const file of files) {
      const fileName = `${Date.now()}-${file.originalname}`;

      const { error } = await supabase.storage
        .from('accounts')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) throw error;

      const { data } = supabase.storage.from('accounts').getPublicUrl(fileName);

      imageUrls.push(data.publicUrl);
    }

    const { data, error } = await supabase
      .from('listings')
      .insert([
        {
          game,
          heroic_emblem: heroicEmblem,
          level,
          price,
          description,
          images: imageUrls,
          is_sold: false,
        },
      ])
      .select();

    if (error) throw error;
    await redis.del('listings');

    return data;
  }

  async getAll() {
    const supabase = getSupabase();
    const cachedListings = await redis.get('listings');

    if (cachedListings) {
      console.log('REDIS HIT');
      return cachedListings;
    }

    console.log('SUPABASE HIT');

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    await redis.set('listings', data, {
      ex: 300,
    });

    return data;
  }

  async markAsSold(id: string) {
    console.log('MARK AS SOLD FUNCTION RUNNING');
    const supabase = getSupabase();

    console.log('BEFORE UPDATE');

    const { data, error } = await supabase
      .from('listings')
      .update({ is_sold: true })
      .eq('id', id)
      .select();

    console.log('AFTER UPDATE:', data);
    console.log('ERROR:', error);

    if (error) throw error;
    await redis.del('listings');

    return data;
  }

  async deleteListing(id: string) {
    console.log('DELETE FUNCTION RUNNING');
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await redis.del('listings');

    return data;
  }
}
