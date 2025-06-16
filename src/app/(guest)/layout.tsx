import Footer from "@/components/footer";
import SimpleHeader from "./simple-header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SimpleHeader />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
