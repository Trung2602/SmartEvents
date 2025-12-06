"use client";

import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
	const { user } = useContext(AuthContext);

	return (
		<div className="p-6 max-w-4xl mx-auto text-foreground">
			<div className="flex items-center gap-6">
				<div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex items-center justify-center text-3xl font-bold">
					{user?.avatarUrl ? (
						<img src={user.avatarUrl} alt={user?.name || 'avatar'} className="w-full h-full object-cover" />
					) : (
						<span>{(user?.name || user?.email || 'U').charAt(0).toUpperCase()}</span>
					)}
				</div>

				<div>
					<h1 className="text-2xl font-bold">{user?.name || 'Your name'}</h1>
					<p className="text-sm text-zinc-500">{user?.email || ''}</p>
					<div className="mt-4">
						<Button variant="outline" onClick={() => alert('Edit profile not implemented')}>Edit profile</Button>
					</div>
				</div>
			</div>

			<div className="mt-8 bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
				<h2 className="font-semibold mb-2">About</h2>
				<p className="text-sm text-zinc-500">This is your profile page. You can extend it to show additional user data, saved events, preferences, and more.</p>
			</div>
		</div>
	);
}

