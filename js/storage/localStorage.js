// script para manejar el almacenamiento en localStorage

export default class LocalStorage {
    constructor(localStorageKey) {
        this.localStorageKey = localStorageKey;
        this.datas = [];
    }

    // Guardar un nuevo elemento
    saveLocalStorage(data) {
        try {
            // Obtener datos existentes o array vacío
            this.datas = this.readLocalStorage() || [];
            
            // Asignar ID si no tiene
            if (!data.id) {
                data.id = this.generateId();
            }
            
            // Agregar nuevo dato
            this.datas.push(data);
            
            // Guardar en localStorage
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.datas));
            console.log(`datos guardados exitosamente ${data}`);
            
            return data;
        } catch (error) {
            console.log(`Error al guardar en localStorage: ${error.message}`);
            return null;
        }
    }

    // Leer todos los datos
    readLocalStorage() {
        try {
            const datas = JSON.parse(localStorage.getItem(this.localStorageKey));
            return datas || [];
        } catch (error) {
            console.log(`Error al leer localStorage: ${error.message}`);
            return [];
        }
    }

    // Buscar un elemento por ID
    findById(id) {
        try {
            const datas = this.readLocalStorage();
            const data = datas.find(item => item.id == id);
            return data || null;
        } catch (error) {
            console.log(`Error al buscar en localStorage: ${error.message}`);
            return null;
        }
    }

    // Actualizar un elemento existente
    updateLocalStorage(id, newData) {
        try {
            let datas = this.readLocalStorage();
            const index = datas.findIndex(item => item.id == id);
            
            if (index !== -1) {
                // Mantener el ID original y actualizar el resto
                datas[index] = { ...datas[index], ...newData, id: datas[index].id };
                localStorage.setItem(this.localStorageKey, JSON.stringify(datas));
                return datas[index];
            }
            
            console.log(`Elemento con ID ${id} no encontrado`);
            return null;
        } catch (error) {
            console.log(`Error al actualizar localStorage: ${error.message}`);
            return null;
        }
    }

    // Eliminar un elemento
    deleteLocalStorage(id) {
        try {
            let datas = this.readLocalStorage();
            const filteredDatas = datas.filter(item => item.id != id);
            
            if (filteredDatas.length !== datas.length) {
                localStorage.setItem(this.localStorageKey, JSON.stringify(filteredDatas));
                return true;
            }
            
            console.log(`Elemento con ID ${id} no encontrado`);
            return false;
        } catch (error) {
            console.log(`Error al eliminar del localStorage: ${error.message}`);
            return false;
        }
    }

    // Limpiar todos los datos
    clearLocalStorage() {
        try {
            localStorage.removeItem(this.localStorageKey);
            this.datas = [];
            return true;
        } catch (error) {
            console.log(`Error al limpiar localStorage: ${error.message}`);
            return false;
        }
    }

    // Generar ID único (opcional)
    generateId() {
        return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}