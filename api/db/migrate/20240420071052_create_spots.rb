class CreateSpots < ActiveRecord::Migration[7.1]
  def change
    create_table :spots do |t|
      t.references :spotter, foreign_key: { to_table: :members }
      t.references :spotted, foreign_key: { to_table: :members }
      t.decimal :longitude
      t.decimal :latitude
      t.integer :squirrels
      t.integer :points
      t.timestamps
    end
  end
end
