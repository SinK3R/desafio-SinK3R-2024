// Classe que representa os recintos de um zoológico
class RecintosZoo {

    // Construtor da classe
    constructor() {
        // Lista de animais com suas características
        this.animais = [
            { tipo: "LEAO", tamanho: 3, bioma: ["savana"], carnivoro: true },
            { tipo: "LEOPARDO", tamanho: 2, bioma: ["savana"], carnivoro: true },
            { tipo: "CROCODILO", tamanho: 3, bioma: ["rio"], carnivoro: true },
            { tipo: "MACACO", tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false },
            { tipo: "GAZELA", tamanho: 2, bioma: ["savana"], carnivoro: false },
            { tipo: "HIPOPOTAMO", tamanho: 4, bioma: ["savana", "rio"], carnivoro: false }
        ];

        // Lista de recintos com suas características e animais existentes
        this.recintos = [
            { numero: 1, bioma: ["savana"], tamanhoTot: 10, animaisPresentes: [{ tipo: "MACACO", quantidade: 3 }] },
            { numero: 2, bioma: ["floresta"], tamanhoTot: 5, animaisPresentes: [] },
            { numero: 3, bioma: ["savana", "rio"], tamanhoTot: 7, animaisPresentes: [{ tipo: "GAZELA", quantidade: 1 }] },
            { numero: 4, bioma: ["rio"], tamanhoTot: 8, animaisPresentes: [] },
            { numero: 5, bioma: ["savana"], tamanhoTot: 9, animaisPresentes: [{ tipo: "LEAO", quantidade: 1 }] }
        ];
    }

    // Método para analisar quais recintos podem acomodar um determinado animal
    analisaRecintos(animal, quantidade) {
        // Encontra as características do animal solicitado
        const animalApto = this.animais.find(ani => ani.tipo === animal);
    
        // Verifica se o animal é válido e se a quantidade é positiva
        if (!animalApto || quantidade <= 0) {
            return { erro: !animalApto ? "Animal inválido" : "Quantidade inválida", recintosAceitos: null };
        }
        
        // Lista para armazenar recintos viáveis
        let recintosAceitos = [];
    
        // Verifica cada recinto para encontrar os viáveis
        this.recintos.forEach(recinto => {
            
            // Verifica se o bioma do recinto é compatível com o bioma do animal
            const biomaAceito = recinto.bioma.some(biomaRecinto => animalApto.bioma.includes(biomaRecinto));
            if (!biomaAceito) return;

            // Verifica se o recinto já contém animais
            const temAnimais = recinto.animaisPresentes.length > 0;

            // Se o animal é carnívoro e o recinto já contém outros animais, não é viável
            if (animalApto.carnivoro && temAnimais) {
                const contemAnimais = recinto.animaisPresentes.some(ani => ani.tipo !== animal);
                if (contemAnimais) return; 
            }    
    
            // Verifica se o recinto já contém animais carnívoros
            const carnivoroPresente = recinto.animaisPresentes.some(ani => {
                let infoAnimal = this.animais.find(a => a.tipo === ani.tipo);
                return infoAnimal.carnivoro;
            });

            // Se o recinto contém carnívoros e o animal não é carnívoro, não é viável
            if (carnivoroPresente && !animalApto.carnivoro) return; 

            // Calcula o espaço ocupado pelos animais existentes no recinto
            const espacoOcupado = recinto.animaisPresentes.reduce((total, ani) => {
                let infoAnimal = this.animais.find(a => a.tipo === ani.tipo);
                return total + (infoAnimal.tamanho * ani.quantidade);
            }, 0);

            // Calcula o espaço necessário para o animal solicitado
            const espacoNecessario = animalApto.tamanho * quantidade;

            // Calcula o espaço disponível no recinto
            let espacoLivre = recinto.tamanhoTot - espacoOcupado;

            // Se o recinto contém animais de outras espécies
            if (temAnimais) {
                let mesmaEspecie = recinto.animaisPresentes.some(ani => ani.tipo !== animal);

                // Se o animal é um hipopótamo e há outras espécies, verifica se o bioma é compatível
                if (animal === "HIPOPOTAMO" && mesmaEspecie) {
                    const biomaSavanaRio = recinto.bioma.includes("savana") && recinto.bioma.includes("rio");
                    if (!biomaSavanaRio) return; 
                }

                // Se existem outras espécies, considera um espaço adicional
                if (mesmaEspecie) {
                    espacoLivre -= 1;
                }
            }

            // Calcula o espaço livre após a inclusão do novo animal
            const espacoVazio = espacoLivre - espacoNecessario;

            // Se o espaço disponível é suficiente, adiciona o recinto à lista de viáveis
            if (espacoLivre >= espacoNecessario) {
                recintosAceitos.push({ numero: recinto.numero, espacoLivre: espacoVazio, tamanhoTot: recinto.tamanhoTot });
                console.log('Espaço livre:', espacoVazio); 
            }
        });

        // Retorna a lista de recintos viáveis, ou um erro se nenhum for encontrado
        if (recintosAceitos.length > 0) {
            return { recintosAceitos: recintosAceitos.map(r => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.tamanhoTot})`) };
        } else {
            return { erro: "Não há recinto viável" };
        }
    } 
}

export { RecintosZoo as RecintosZoo};
