'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid credentials');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6 w-full max-w-[500px] m-auto text-white", className)} {...props}>
            <Card className="glass-card border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] bg-white/5 pb-2">
                <CardHeader>
                    <CardTitle className="text-2xl tracking-wide font-bold">Login to your account</CardTitle>
                    
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                            <Field>
                                <FieldLabel htmlFor="email">User ID</FieldLabel>
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="User ID"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="glass-input p-3 rounded-lg w-full transition"
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="glass-input p-3 rounded-lg w-full transition"
                                />
                            </Field>
                            <Field className="mt-4">
                                <Button className='w-full bg-fuchsia-600/90 hover:bg-fuchsia-500 text-white py-3 rounded-xl hover:shadow-[0_0_15px_rgba(255,0,255,0.4)] transition font-bold text-base' type="submit" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
