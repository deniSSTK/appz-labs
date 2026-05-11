export enum EquipmentType {
  LABORATORY = 'Laboratory',
  AUDIO_EQUIPMENT = 'Audio Equipment',
  COMPUTER = 'Computer'
}

export interface IEquipment {
  type: EquipmentType;
  name: string;
  isAvailable: boolean;
  providesBonus?: boolean;
}

export class Equipment implements IEquipment {
  constructor(
    public readonly type: EquipmentType,
    public readonly name: string,
    public isAvailable: boolean = true,
    public readonly providesBonus: boolean = false
  ) {}

  public setAvailability(available: boolean): void {
    this.isAvailable = available;
  }

  public getStatus(): string {
    return this.isAvailable ? 'Available' : 'Unavailable';
  }
}

export class EquipmentRegistry {
  private static instance: EquipmentRegistry;
  private equipment: Map<EquipmentType, Equipment> = new Map();

  private constructor() {
    this.initializeEquipment();
  }

  public static getInstance(): EquipmentRegistry {
    if (!EquipmentRegistry.instance) {
      EquipmentRegistry.instance = new EquipmentRegistry();
    }
    return EquipmentRegistry.instance;
  }

  private initializeEquipment(): void {
    this.equipment.set(
      EquipmentType.LABORATORY,
      new Equipment(EquipmentType.LABORATORY, 'Physics Laboratory', true)
    );

    this.equipment.set(
      EquipmentType.AUDIO_EQUIPMENT,
      new Equipment(EquipmentType.AUDIO_EQUIPMENT, 'English Audio Equipment', true)
    );

    this.equipment.set(
      EquipmentType.COMPUTER,
      new Equipment(EquipmentType.COMPUTER, 'Computer Lab', true, true)
    );
  }

  public getEquipment(type: EquipmentType): Equipment | undefined {
    return this.equipment.get(type);
  }

  public getAllEquipment(): Equipment[] {
    return Array.from(this.equipment.values());
  }

  public isEquipmentAvailable(type: EquipmentType): boolean {
    const equipment = this.equipment.get(type);
    return equipment?.isAvailable ?? false;
  }

  public setEquipmentAvailability(type: EquipmentType, available: boolean): void {
    const equipment = this.equipment.get(type);
    if (equipment) {
      equipment.setAvailability(available);
    }
  }

  public getAvailableBonusEquipment(): Equipment[] {
    return Array.from(this.equipment.values()).filter((eq) => eq.isAvailable && eq.providesBonus);
  }
}
