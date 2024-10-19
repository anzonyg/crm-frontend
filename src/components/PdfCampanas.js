/* import React from 'react';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    backgroundColor: '#f5f5f5',
    flex: 1,
  }, 
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',  // Borde general de la tabla
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',  // Cada fila es una dirección horizontal
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,  // Espaciado vertical entre filas
  },
  headerRow: {
    backgroundColor: '#f0f0f0',  // Fondo diferente para el encabezado
    borderBottomWidth: 2,  // Borde más grueso en el encabezado
    borderColor: '#ccc',
  },
  cell: {
    flex: 1,  // Hace que las celdas se distribuyan equitativamente
    padding: 10,
    justifyContent: 'center',
  },
  headerCell: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    fontWeight: 'bold',  // Texto en negrita para el encabezado
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
});

const PdfCampanas = ({ data }) => {
    console.log(data);
    return (
        <Document>
        <Page style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>Reporte de Campañas</Text>
            <Text style={styles.text}>Nombre de Campaña: {data.nombre}</Text>
            <Text style={styles.text}>Estado de Campaña: {data.estado}</Text>
            <Text style={styles.text}>Fecha Creación: {data.fechaCreacion}</Text>
            <Text style={styles.text}>Fecha Inicio: {data.fechaInicio}</Text>
            <Text style={styles.text}>Fecha Estimación Cierre: {data.fechaEstimacionCierre}</Text>
            <Text style={styles.text}>Presupuesto: {data.presupuesto}</Text>
            <Text style={styles.text}>Coste Real: {data.costeReal}</Text>
          </View>
        </Page>
      </Document>
    ); 
}
  
  export default PdfCampanas;
  */
