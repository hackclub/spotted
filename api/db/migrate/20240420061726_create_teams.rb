class CreateTeams < ActiveRecord::Migration[7.1]
  def change
    create_table :teams do |t|
      t.references :creator, foreign_key: { to_table: :users }
      t.string :name
      t.string :emoji

      t.timestamps
    end
  end
end
