import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1758289312674 implements MigrationInterface {
    name = 'Migrations1758289312674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`roleId\` int NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`price\` decimal(10,2) NOT NULL, \`category\` varchar(255) NOT NULL, \`imageUrl\` varchar(255) NULL, \`tags\` text NULL, \`inStock\` tinyint NOT NULL DEFAULT 1, \`weight\` int NULL, \`length\` int NULL, \`width\` int NULL, \`height\` int NULL, \`sellerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_e40a1dd2909378f0da1f34f7bd6\` FOREIGN KEY (\`sellerId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        // Seed roles data
        await queryRunner.manager.insert('roles', {
            name: 'user',
            description: 'Regular user with basic permissions',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        await queryRunner.manager.insert('roles', {
            name: 'admin',
            description: 'Administrator with full system access',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Seed products data
        // 5 Clothes
        await queryRunner.manager.insert('products', {
            name: 'Classic White T-Shirt',
            description: 'Comfortable cotton t-shirt perfect for everyday wear',
            price: 19.99,
            category: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
            tags: 'cotton,comfortable,casual',
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await queryRunner.manager.insert('products', {
            name: 'Denim Jeans',
            description: 'High-quality denim jeans with perfect fit',
            price: 59.99,
            category: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
            tags: 'denim,jeans,casual',
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await queryRunner.manager.insert('products', {
            name: 'Winter Jacket',
            description: 'Warm and stylish winter jacket for cold weather',
            price: 89.99,
            category: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
            tags: 'winter,warm,jacket',
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await queryRunner.manager.insert('products', {
            name: 'Running Sneakers',
            description: 'Comfortable running shoes for sports and daily activities',
            price: 79.99,
            category: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
            tags: 'sneakers,running,sports',
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await queryRunner.manager.insert('products', {
            name: 'Summer Dress',
            description: 'Elegant summer dress perfect for warm weather',
            price: 49.99,
            category: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
            tags: 'dress,summer,elegant',
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // 5 Laptops
        await queryRunner.manager.insert('products', {
            name: 'MacBook Pro 16"',
            description: 'Powerful laptop with M2 chip for professionals',
            price: 2499.99,
            category: 'laptop',
            imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
            tags: 'macbook,professional,powerful',
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await queryRunner.manager.insert('products', {
            name: 'Dell XPS 13',
            description: 'Ultra-thin laptop with stunning display',
            price: 1299.99,
            category: 'laptop',
            imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
            tags: 'dell,ultrabook,portable',
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await queryRunner.manager.insert('products', {
            name: 'HP Pavilion Gaming',
            description: 'Gaming laptop with high-performance graphics',
            price: 999.99,
            category: 'laptop',
            imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
            tags: 'gaming,hp,graphics',
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await queryRunner.manager.insert('products', {
            name: 'Lenovo ThinkPad X1',
            description: 'Business laptop with excellent keyboard and durability',
            price: 1599.99,
            category: 'laptop',
            imageUrl: 'https://images.unsplash.com/photo-1587831990718-80c1e9a2b8b0?w=400',
            tags: 'business,thinkpad,durable',
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await queryRunner.manager.insert('products', {
            name: 'ASUS ZenBook 14',
            description: 'Sleek and lightweight laptop for productivity',
            price: 1199.99,
            category: 'laptop',
            imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
            tags: 'asus,lightweight,productivity',
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // 5 Drinks
        await queryRunner.manager.insert('products', {
            name: 'Premium Coffee Beans',
            description: 'High-quality arabica coffee beans from Colombia',
            price: 24.99,
            category: 'drinks',
            imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
            tags: 'coffee,arabica,premium',
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await queryRunner.manager.insert('products', {
            name: 'Green Tea Collection',
            description: 'Organic green tea with health benefits',
            price: 18.99,
            category: 'drinks',
            imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
            tags: 'tea,green,organic',
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await queryRunner.manager.insert('products', {
            name: 'Energy Drink Mix',
            description: 'Natural energy drink powder with vitamins',
            price: 14.99,
            category: 'drinks',
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
            tags: 'energy,vitamins,natural',
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await queryRunner.manager.insert('products', {
            name: 'Sparkling Water',
            description: 'Refreshing sparkling water with natural flavors',
            price: 8.99,
            category: 'drinks',
            imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
            tags: 'water,sparkling,refreshing',
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await queryRunner.manager.insert('products', {
            name: 'Protein Shake',
            description: 'Chocolate protein shake for fitness enthusiasts',
            price: 19.99,
            category: 'drinks',
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
            tags: 'protein,chocolate,fitness',
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete('products', { category: 'drinks' });
        await queryRunner.manager.delete('products', { category: 'laptop' });
        await queryRunner.manager.delete('products', { category: 'clothes' });
        
        await queryRunner.manager.delete('roles', { name: 'admin' });
        await queryRunner.manager.delete('roles', { name: 'user' });
        
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_e40a1dd2909378f0da1f34f7bd6\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
