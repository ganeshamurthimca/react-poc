import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique } from 'sequelize-typescript';

@Table({
    tableName: 'customers',
    timestamps: true,
})
export class Customer extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'first_name',
    })
    firstName!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'last_name',
    })
    lastName!: string;

    @Unique
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        validate: {
            isNumeric: true,
        },
    })
    phone?: string;
}