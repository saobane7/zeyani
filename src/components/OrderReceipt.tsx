import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Printer, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShippingInfo {
  type: string;
  label: string;
  price: number;
}

interface OrderReceiptProps {
  orderId: string;
  items: ReceiptItem[];
  shipping: ShippingInfo;
  subtotal: number;
  total: number;
  date: Date;
  payerEmail?: string;
}

const OrderReceipt = ({
  orderId,
  items,
  shipping,
  subtotal,
  total,
  date,
  payerEmail,
}: OrderReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!receiptRef.current) return;

    // Create a printable version
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Veuillez autoriser les popups pour télécharger le reçu.");
      return;
    }

    const styles = `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          padding: 40px; 
          max-width: 800px; 
          margin: 0 auto;
          color: #1a1a1a;
        }
        .header { 
          text-align: center; 
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #d4af37;
        }
        .logo { 
          font-size: 28px; 
          font-weight: bold; 
          color: #d4af37;
          font-family: 'Playfair Display', serif;
          margin-bottom: 8px;
        }
        .subtitle { 
          color: #666; 
          font-size: 14px;
        }
        .receipt-title {
          font-size: 24px;
          margin: 30px 0 20px;
          color: #1a1a1a;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .info-box {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
        }
        .info-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 14px;
          font-weight: 500;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .items-table th {
          text-align: left;
          padding: 12px 0;
          border-bottom: 2px solid #e5e5e5;
          font-size: 12px;
          text-transform: uppercase;
          color: #666;
        }
        .items-table td {
          padding: 15px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .items-table .name { font-weight: 500; }
        .items-table .qty { text-align: center; color: #666; }
        .items-table .price { text-align: right; }
        .totals {
          margin-top: 20px;
          padding-top: 20px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        .total-row.final {
          font-size: 18px;
          font-weight: bold;
          padding-top: 15px;
          margin-top: 10px;
          border-top: 2px solid #d4af37;
        }
        .footer {
          margin-top: 50px;
          padding-top: 30px;
          border-top: 1px solid #e5e5e5;
          text-align: center;
          color: #888;
          font-size: 12px;
        }
        .footer p { margin: 5px 0; }
        .legal {
          margin-top: 30px;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 8px;
          font-size: 11px;
          color: #666;
        }
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    `;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu - Niger Chic Designs - ${orderId}</title>
          <meta charset="utf-8">
          ${styles}
        </head>
        <body>
          <div class="header">
            <div class="logo">Niger Chic Designs</div>
            <div class="subtitle">Bijoux artisanaux touaregs</div>
          </div>

          <h1 class="receipt-title">Reçu de commande</h1>

          <div class="info-grid">
            <div class="info-box">
              <div class="info-label">Numéro de commande</div>
              <div class="info-value">${orderId}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Date de commande</div>
              <div class="info-value">${format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr })}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Mode de paiement</div>
              <div class="info-value">PayPal</div>
            </div>
            <div class="info-box">
              <div class="info-label">Livraison</div>
              <div class="info-value">${shipping.label}</div>
            </div>
          </div>

          <h2 style="font-size: 16px; margin: 30px 0 15px; color: #666;">Articles commandés</h2>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Article</th>
                <th style="text-align: center;">Qté</th>
                <th style="text-align: right;">Prix unitaire</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td class="name">${item.name}</td>
                  <td class="qty">${item.quantity}</td>
                  <td class="price">${item.price.toFixed(2)} €</td>
                  <td class="price">${(item.price * item.quantity).toFixed(2)} €</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Sous-total (${items.reduce((sum, item) => sum + item.quantity, 0)} article${items.reduce((sum, item) => sum + item.quantity, 0) > 1 ? "s" : ""})</span>
              <span>${subtotal.toFixed(2)} €</span>
            </div>
            <div class="total-row">
              <span>Frais de livraison (${shipping.label})</span>
              <span>${shipping.price === 0 ? "Gratuit" : shipping.price.toFixed(2) + " €"}</span>
            </div>
            <div class="total-row final">
              <span>TOTAL TTC</span>
              <span>${total.toFixed(2)} €</span>
            </div>
          </div>

          <div class="legal">
            <p><strong>Informations légales</strong></p>
            <p>Ce reçu fait foi de votre achat auprès de Niger Chic Designs.</p>
            <p>Conformément au RGPD, vos données personnelles sont conservées pendant 3 ans après réception de votre commande.</p>
            <p>Pour toute question concernant votre commande, contactez-nous via notre formulaire de contact.</p>
          </div>

          <div class="footer">
            <p><strong>Niger Chic Designs</strong></p>
            <p>Bijoux artisanaux touaregs - Fait main au Niger</p>
            <p>www.niger-chic-designs.lovable.app</p>
            <p style="margin-top: 15px;">Merci pour votre confiance !</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    
    // Wait for content to load then trigger print/save as PDF
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const handlePrint = () => {
    handleDownload();
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Download Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button onClick={handleDownload} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Télécharger le reçu (PDF)
        </Button>
        <Button variant="outline" onClick={handlePrint} className="flex-1">
          <Printer className="h-4 w-4 mr-2" />
          Imprimer le reçu
        </Button>
      </div>

      {/* Receipt Preview */}
      <div
        ref={receiptRef}
        className="bg-card border rounded-lg p-6 shadow-sm"
      >
        {/* Header */}
        <div className="text-center mb-6 pb-4 border-b-2 border-primary">
          <h2 className="text-2xl font-serif text-primary">Niger Chic Designs</h2>
          <p className="text-sm text-muted-foreground">Bijoux artisanaux touaregs</p>
        </div>

        {/* Receipt Title */}
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Reçu de commande</h3>
        </div>

        {/* Order Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted/50 rounded-md p-3">
            <p className="text-xs text-muted-foreground uppercase mb-1">N° de commande</p>
            <p className="text-sm font-mono font-medium truncate">{orderId}</p>
          </div>
          <div className="bg-muted/50 rounded-md p-3">
            <p className="text-xs text-muted-foreground uppercase mb-1">Date</p>
            <p className="text-sm font-medium">
              {format(date, "d MMM yyyy", { locale: fr })}
            </p>
          </div>
          <div className="bg-muted/50 rounded-md p-3">
            <p className="text-xs text-muted-foreground uppercase mb-1">Paiement</p>
            <p className="text-sm font-medium">PayPal</p>
          </div>
          <div className="bg-muted/50 rounded-md p-3">
            <p className="text-xs text-muted-foreground uppercase mb-1">Livraison</p>
            <p className="text-sm font-medium">{shipping.label}</p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Items */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase mb-3">
            Articles ({totalItems})
          </h4>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} × {item.price.toFixed(2)} €
                  </p>
                </div>
                <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sous-total</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Livraison</span>
            <span>{shipping.price === 0 ? "Gratuit" : `${shipping.price.toFixed(2)} €`}</span>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total TTC</span>
            <span className="text-primary">{total.toFixed(2)} €</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
          <p>Merci pour votre achat chez Niger Chic Designs</p>
          <p className="mt-1">Ce reçu fait foi de votre commande</p>
        </div>
      </div>

      {/* Info Notice */}
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>💡 Conseil :</strong> Conservez ce reçu pour vos dossiers. Vous pouvez 
          également le retrouver dans votre historique de commandes.
        </p>
      </div>
    </div>
  );
};

export default OrderReceipt;
