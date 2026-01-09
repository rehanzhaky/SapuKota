# 🎨 Shadcn/ui Integration Guide - SapuKota.id

## ✅ Yang Sudah Disetup

### 1. **Dependencies Installed**
```json
{
  "devDependencies": {
    "tailwindcss-animate": "^1.x",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "lucide-react": "^0.x"
  }
}
```

### 2. **File Structure**
```
frontend/
├── src/
│   ├── lib/
│   │   └── utils.js              ✅ Utility functions (cn)
│   ├── components/
│   │   └── ui/
│   │       ├── button.jsx        ✅ Button component
│   │       ├── card.jsx          ✅ Card components
│   │       ├── badge.jsx         ✅ Badge component
│   │       └── input.jsx         ✅ Input component
│   └── pages/
│       └── HomeShadcn.jsx        ✅ Example page with Shadcn
├── jsconfig.json                 ✅ Path alias config
├── vite.config.js                ✅ Updated with @ alias
├── tailwind.config.js            ✅ Shadcn theme config
└── src/index.css                 ✅ CSS variables
```

### 3. **Configuration Files**

#### `jsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### `vite.config.js`
```javascript
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

#### `tailwind.config.js`
- ✅ Dark mode support
- ✅ CSS variables for theming
- ✅ Custom colors (primary green, secondary orange)
- ✅ Animations (accordion, etc.)
- ✅ tailwindcss-animate plugin

---

## 🎯 Cara Menggunakan Shadcn Components

### **1. Button Component**

```jsx
import { Button } from '@/components/ui/button';

// Variants
<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

// With Link
<Button asChild>
  <Link to="/laporan">Lihat Laporan</Link>
</Button>
```

### **2. Card Component**

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Laporan Sampah</CardTitle>
    <CardDescription>Jl. Sudirman No. 123</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Tumpukan sampah di pinggir jalan</p>
  </CardContent>
  <CardFooter>
    <Button>Lihat Detail</Button>
  </CardFooter>
</Card>
```

### **3. Badge Component**

```jsx
import { Badge } from '@/components/ui/badge';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>
```

### **4. Input Component**

```jsx
import { Input } from '@/components/ui/input';

<Input type="text" placeholder="Nama Anda" />
<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
```

---

## 🎨 Custom Theme Colors

Shadcn sudah dikonfigurasi dengan warna SapuKota.id:

```css
:root {
  --primary: 142 71% 45%;        /* Green #10B981 */
  --secondary: 18 95% 54%;       /* Orange #F97316 */
  --destructive: 0 84.2% 60.2%;  /* Red */
  --muted: 210 40% 96.1%;        /* Gray */
}
```

Anda tetap bisa menggunakan warna lama:
- `bg-primary-500` → Hijau
- `bg-secondary-500` → Oren
- `text-primary-500` → Text hijau

---

## 📦 Menambah Component Shadcn Lainnya

### **Manual (Recommended)**

Copy component dari https://ui.shadcn.com/docs/components

Contoh menambah **Alert** component:

1. Buat file `frontend/src/components/ui/alert.jsx`
2. Copy code dari https://ui.shadcn.com/docs/components/alert
3. Paste dan sesuaikan import path

### **Menggunakan CLI (Jika koneksi internet stabil)**

```bash
cd frontend
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add table
npx shadcn@latest add toast
```

---

## 🚀 Contoh Implementasi

### **Home Page dengan Shadcn**

File: `frontend/src/pages/HomeShadcn.jsx` sudah dibuat dengan:
- ✅ Hero section dengan Button
- ✅ Stats cards dengan Card component
- ✅ Recent reports dengan Card & Badge
- ✅ Icons dari lucide-react

### **Cara Menggunakan:**

Update `App.jsx`:
```jsx
import HomeShadcn from './pages/HomeShadcn';

// Ganti route
<Route path="/" element={<HomeShadcn />} />
```

---

## 🎯 Component Recommendations

### **Untuk Dashboard Admin:**
- ✅ **Table** - Untuk daftar laporan
- ✅ **Dialog** - Untuk modal review laporan
- ✅ **Select** - Untuk dropdown status
- ✅ **Form** - Untuk form input
- ✅ **Toast** - Untuk notifikasi

### **Untuk Form Laporan:**
- ✅ **Input** - Text fields
- ✅ **Textarea** - Description
- ✅ **Select** - Kategori sampah
- ✅ **Button** - Submit button

### **Untuk Petugas Dashboard:**
- ✅ **Card** - Task cards
- ✅ **Badge** - Status badges
- ✅ **Button** - Action buttons
- ✅ **Dialog** - Update task modal

---

## 🎨 Icons dengan Lucide React

```jsx
import { MapPin, Calendar, Tag, TrendingUp, CheckCircle, Clock } from 'lucide-react';

<MapPin className="h-4 w-4" />
<Calendar className="h-5 w-5 text-gray-500" />
<CheckCircle className="h-6 w-6 text-green-500" />
```

Browse icons: https://lucide.dev/icons/

---

## 💡 Tips & Best Practices

1. **Gunakan `cn()` utility** untuk merge classNames:
   ```jsx
   import { cn } from '@/lib/utils';
   
   <div className={cn("base-class", isActive && "active-class")} />
   ```

2. **Kombinasikan dengan existing components:**
   ```jsx
   // Ganti button lama
   <button className="btn-primary">Submit</button>
   
   // Dengan Shadcn Button
   <Button>Submit</Button>
   ```

3. **Gunakan variants untuk konsistensi:**
   ```jsx
   <Badge variant="success">Selesai</Badge>
   <Badge variant="warning">Pending</Badge>
   ```

4. **Dark mode ready:**
   ```jsx
   // Tambahkan class "dark" ke html untuk dark mode
   <html className="dark">
   ```

---

## 📚 Resources

- **Shadcn/ui Docs:** https://ui.shadcn.com
- **Lucide Icons:** https://lucide.dev
- **Tailwind CSS:** https://tailwindcss.com
- **CVA (Class Variance Authority):** https://cva.style

---

## ✅ Next Steps

1. ✅ Test `HomeShadcn.jsx` di browser
2. ✅ Update existing pages dengan Shadcn components
3. ✅ Add more components (Dialog, Table, Select, etc.)
4. ✅ Customize theme colors jika perlu
5. ✅ Implement dark mode (optional)

---

**Shadcn/ui sudah terintegrasi dengan sempurna!** 🎉

Sekarang Anda punya akses ke 50+ beautiful components yang bisa langsung dipakai! 🚀

