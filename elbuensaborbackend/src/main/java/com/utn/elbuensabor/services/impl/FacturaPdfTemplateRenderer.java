package com.utn.elbuensabor.services.impl;

import com.utn.elbuensabor.entities.FacturaVenta;
import com.utn.elbuensabor.entities.FacturaVentaDetalle;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import static java.awt.Color.*;

@Component
public class FacturaPdfTemplateRenderer {

    @Value("${app.factura.logo-path:../uploads/el buen sabor/logo.png}")
    private String facturaLogoPath;

    public void render(Path filePath, FacturaVenta factura) throws IOException {
        render(filePath, factura, "FACTURA");
    }

    public void render(Path filePath, FacturaVenta factura, String tipoComprobante) throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                float pageWidth = page.getMediaBox().getWidth();
                float topY = page.getMediaBox().getHeight();
                float left = 32f;
                float right = pageWidth - 32f;

                drawHeader(content, document, factura, left, right, topY, tipoComprobante);

                float y = topY - 120f;
                y = drawMetaBox(content, factura, left, right, y);
                y = drawClientSection(content, factura, left, right, y - 12f);
                y = drawItemsTable(content, factura, left, right, y - 18f);
                drawTotals(content, factura, right - 220f, right, y - 6f);

                drawFooter(content, left, right, 30f);
            }

            document.save(filePath.toFile());
        }
    }

    private void drawHeader(PDPageContentStream content,
                            PDDocument document,
                            FacturaVenta factura,
                            float left,
                            float right,
                            float topY,
                            String tipoComprobante) throws IOException {
        float headerHeight = 84f;
        content.setNonStrokingColor(new java.awt.Color(28, 30, 36));
        content.addRect(0, topY - headerHeight, right + left, headerHeight);
        content.fill();

        float logoTextOffset = drawLogo(content, document, left, topY);

        writeText(content, "El Buen Sabor", left + logoTextOffset, topY - 35, PDType1Font.HELVETICA_BOLD, 14f, WHITE);
        writeText(content, "Comida artesanal", left + logoTextOffset, topY - 52, PDType1Font.HELVETICA, 10f, LIGHT_GRAY);
        writeText(content, tipoComprobante, right - 180, topY - 34, PDType1Font.HELVETICA, 10f, LIGHT_GRAY);
        writeRightText(content, "#" + factura.getNumeroComprobante(), right, topY - 53, PDType1Font.HELVETICA_BOLD, 16f, WHITE);
    }

    private float drawLogo(PDPageContentStream content,
                           PDDocument document,
                           float left,
                           float topY) throws IOException {
        Path logoPath = resolveLogoPath();
        if (!Files.exists(logoPath)) {
            return 96f;
        }

        BufferedImage rawLogo = ImageIO.read(logoPath.toFile());
        if (rawLogo == null) {
            return 96f;
        }

        BufferedImage trimmedLogo = trimTransparentBorders(rawLogo);
        PDImageXObject logo = LosslessFactory.createFromImage(document, trimmedLogo);

        float maxWidth = 92f;
        float maxHeight = 46f;
        float scale = Math.min(maxWidth / logo.getWidth(), maxHeight / logo.getHeight());

        float drawWidth = logo.getWidth() * scale;
        float drawHeight = logo.getHeight() * scale;

        float logoX = left - 2 + (maxWidth - drawWidth) / 2f;
        float logoY = topY - 66 + (maxHeight - drawHeight) / 2f;

        content.drawImage(logo, logoX, logoY, drawWidth, drawHeight);
        return Math.max(logoX + drawWidth - left + 8f, 96f);
    }

    private BufferedImage trimTransparentBorders(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();

        int minX = width;
        int minY = height;
        int maxX = -1;
        int maxY = -1;

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int alpha = (image.getRGB(x, y) >>> 24) & 0xFF;
                if (alpha > 0) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
        }

        if (maxX < minX || maxY < minY) {
            return image;
        }

        return image.getSubimage(minX, minY, maxX - minX + 1, maxY - minY + 1);
    }

    private float drawMetaBox(PDPageContentStream content,
                              FacturaVenta factura,
                              float left,
                              float right,
                              float startY) throws IOException {
        boolean hasPaymentId = factura.getPaymentId() != null && !factura.getPaymentId().isBlank();
        float boxH = hasPaymentId ? 78f : 60f;
        content.setNonStrokingColor(new java.awt.Color(245, 246, 248));
        content.addRect(left, startY - boxH, right - left, boxH);
        content.fill();

        writeText(content, "FECHA DE EMISIÓN", left + 14, startY - 18, PDType1Font.HELVETICA, 9f, GRAY);
        String fecha = factura.getFechaFacturacion()
                .format(DateTimeFormatter.ofPattern("d 'de' MMMM 'de' yyyy, HH:mm", new Locale("es", "AR")));
        writeText(content, fecha, left + 14, startY - 38, PDType1Font.HELVETICA_BOLD, 12f, BLACK);

        writeText(content, "MÉTODO DE PAGO", right - 170, startY - 18, PDType1Font.HELVETICA, 9f, GRAY);
        writeText(content,
                factura.getFormaPago().name().equals("MP") ? "Mercado Pago" : "Efectivo",
                right - 170, startY - 38, PDType1Font.HELVETICA_BOLD, 12f, new java.awt.Color(0, 102, 153));

        if (hasPaymentId) {
            writeText(content, "ID DE PAGO", right - 170, startY - 56, PDType1Font.HELVETICA, 9f, GRAY);
            writeText(content, factura.getPaymentId(), right - 170, startY - 72, PDType1Font.HELVETICA_BOLD, 10f, BLACK);
        }

        content.setStrokingColor(new java.awt.Color(218, 218, 218));
        content.moveTo(left, startY - boxH);
        content.lineTo(right, startY - boxH);
        content.stroke();

        return startY - boxH;
    }

    private float drawClientSection(PDPageContentStream content,
                                    FacturaVenta factura,
                                    float left,
                                    float right,
                                    float startY) throws IOException {
        writeText(content, "FACTURADO A", left + 2, startY - 6, PDType1Font.HELVETICA, 9f, GRAY);
        writeText(content,
                factura.getPedido().getCliente().getNombre() + " " + factura.getPedido().getCliente().getApellido(),
                left + 2, startY - 25, PDType1Font.HELVETICA_BOLD, 15f, BLACK);
        writeText(content, safe(factura.getPedido().getCliente().getEmail()), left + 2, startY - 42, PDType1Font.HELVETICA, 11f, DARK_GRAY);
        if (factura.getPedido().getCliente().getTelefono() != null && !factura.getPedido().getCliente().getTelefono().isBlank()) {
            writeText(content, factura.getPedido().getCliente().getTelefono(), left + 2, startY - 57, PDType1Font.HELVETICA, 11f, DARK_GRAY);
        }
        if (factura.getPedido().getCliente().getDomicilio() != null) {
            var d = factura.getPedido().getCliente().getDomicilio();
            String direccion = String.format("%s %s%s",
                    safe(d.getCalle()),
                    safe(d.getNumero()),
                    d.getLocalidad() != null ? ", " + safe(d.getLocalidad().getNombre()) : "");
            writeText(content, direccion.trim(), left + 2, startY - 72, PDType1Font.HELVETICA, 11f, DARK_GRAY);
        }

        content.setStrokingColor(new java.awt.Color(225, 225, 225));
        content.moveTo(left, startY - 85);
        content.lineTo(right, startY - 85);
        content.stroke();

        return startY - 85;
    }

    private float drawItemsTable(PDPageContentStream content,
                                 FacturaVenta factura,
                                 float left,
                                 float right,
                                 float startY) throws IOException {
        float productX = left + 2;
        float qtyX = right - 235;
        float unitX = right - 150;
        float subX = right - 2;

        writeText(content, "PRODUCTO", productX, startY, PDType1Font.HELVETICA, 10f, DARK_GRAY);
        writeText(content, "CANT.", qtyX, startY, PDType1Font.HELVETICA, 10f, DARK_GRAY);
        writeText(content, "P. UNIT.", unitX, startY, PDType1Font.HELVETICA, 10f, DARK_GRAY);
        writeRightText(content, "SUBTOTAL", subX, startY, PDType1Font.HELVETICA, 10f, DARK_GRAY);

        content.setStrokingColor(new java.awt.Color(58, 58, 58));
        content.moveTo(left, startY - 7);
        content.lineTo(right, startY - 7);
        content.stroke();

        float y = startY - 28;
        int idx = 0;
        for (FacturaVentaDetalle d : factura.getDetalles()) {
            if (idx % 2 == 0) {
                content.setNonStrokingColor(new java.awt.Color(250, 250, 250));
                content.addRect(left, y - 12, right - left, 22);
                content.fill();
            }

            String descripcion = d.getArticuloManufacturado() != null
                    ? d.getArticuloManufacturado().getDenominacion()
                    : d.getArticuloInsumo().getDenominacion();
            double sub = d.getSubTotal().doubleValue();
            int cant = d.getCantidad() != null ? d.getCantidad() : 0;
            double unit = cant > 0 ? sub / cant : sub;

            writeText(content, descripcion, productX, y, PDType1Font.HELVETICA_BOLD, 11.5f, BLACK);
            writeText(content, String.valueOf(cant), qtyX + 10, y, PDType1Font.HELVETICA, 11.5f, DARK_GRAY);
            writeRightText(content, formatMoney(unit), unitX + 62, y, PDType1Font.HELVETICA, 11.5f, DARK_GRAY);
            writeRightText(content, formatMoney(sub), subX, y, PDType1Font.HELVETICA_BOLD, 11.5f, BLACK);
            y -= 24;
            idx++;
        }

        return y;
    }

    private void drawTotals(PDPageContentStream content,
                            FacturaVenta factura,
                            float left,
                            float right,
                            float startY) throws IOException {
        content.setStrokingColor(new java.awt.Color(210, 210, 210));
        content.moveTo(left, startY);
        content.lineTo(right, startY);
        content.stroke();

        float y = startY - 18;
        writeText(content, "Subtotal", left, y, PDType1Font.HELVETICA, 12f, DARK_GRAY);
        writeRightText(content, formatMoney(factura.getSubTotal()), right, y, PDType1Font.HELVETICA, 12f, DARK_GRAY);

        if (factura.getDescuento() != null && factura.getDescuento() > 0) {
            y -= 17;
            writeText(content, "Descuento", left, y, PDType1Font.HELVETICA, 12f, DARK_GRAY);
            writeRightText(content, "-" + formatMoney(factura.getDescuento()), right, y, PDType1Font.HELVETICA, 12f, DARK_GRAY);
        }

        if (factura.getGastosEnvio() != null && factura.getGastosEnvio() > 0) {
            y -= 17;
            writeText(content, "Envío", left, y, PDType1Font.HELVETICA, 12f, DARK_GRAY);
            writeRightText(content, formatMoney(factura.getGastosEnvio()), right, y, PDType1Font.HELVETICA, 12f, DARK_GRAY);
        }

        y -= 14;
        content.setStrokingColor(new java.awt.Color(210, 210, 210));
        content.moveTo(left, y);
        content.lineTo(right, y);
        content.stroke();

        y -= 23;
        writeText(content, "Total", left, y, PDType1Font.HELVETICA_BOLD, 16f, BLACK);
        writeRightText(content, formatMoney(factura.getTotalVenta()), right, y, PDType1Font.HELVETICA_BOLD, 16f, BLACK);
    }

    private void drawFooter(PDPageContentStream content,
                            float left,
                            float right,
                            float bottomY) throws IOException {

        float centerX = (left + right) / 2;

        content.setStrokingColor(new java.awt.Color(225, 225, 225));
        content.moveTo(left, bottomY + 24);
        content.lineTo(right, bottomY + 24);
        content.stroke();

        writeCenteredText(
                content,
                "El Buen Sabor · Sucursal Principal · Tel: (0261) 123-4567",
                centerX,
                bottomY + 10,
                PDType1Font.HELVETICA,
                9f,
                GRAY
        );

        writeCenteredText(
                content,
                "¡Gracias por tu compra! Este comprobante es válido como factura.",
                centerX,
                bottomY - 2,
                PDType1Font.HELVETICA,
                9f,
                GRAY
        );
    }

    private void writeText(PDPageContentStream content,
                           String text,
                           float x,
                           float y,
                           PDFont font,
                           float size,
                           java.awt.Color color) throws IOException {
        content.beginText();
        content.setFont(font, size);
        content.setNonStrokingColor(color);
        content.newLineAtOffset(x, y);
        content.showText(text != null ? text : "");
        content.endText();
    }

    private void writeRightText(PDPageContentStream content,
                                String text,
                                float rightX,
                                float y,
                                PDFont font,
                                float size,
                                java.awt.Color color) throws IOException {
        float width = (font.getStringWidth(text != null ? text : "") / 1000f) * size;
        writeText(content, text, rightX - width, y, font, size, color);
    }

    private String formatMoney(Double value) {
        if (value == null) return "$0,00";
        return String.format(new Locale("es", "AR"), "$%,.2f", value);
    }


    private Path resolveLogoPath() {
        Path configured = Path.of(facturaLogoPath);
        if (Files.exists(configured)) return configured;

        Path rootRelative = Path.of("uploads", "el buen sabor", "logo.png");
        if (Files.exists(rootRelative)) return rootRelative;

        Path parentRelative = Path.of("..", "uploads", "el buen sabor", "logo.png");
        if (Files.exists(parentRelative)) return parentRelative;

        return configured;
    }

    private void writeCenteredText(PDPageContentStream content,
                                   String text,
                                   float centerX,
                                   float y,
                                   PDFont font,
                                   float size,
                                   java.awt.Color color) throws IOException {
        if (text == null) text = "";

        float textWidth = (font.getStringWidth(text) / 1000f) * size;
        float startX = centerX - (textWidth / 2);

        writeText(content, text, startX, y, font, size, color);
    }

    private String safe(String value) {
        return value != null ? value : "";
    }
}
