'use client';

import React from 'react';
import PostEditor from '@/components/admin/PostEditor';

export default function EditPostPage({ params }: { params: { id: string } }) {
  return <PostEditor initialId={params.id} />;
}
