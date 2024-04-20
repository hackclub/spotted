# frozen_string_literal: true

class Spot < ApplicationRecord
  belongs_to :spotter, class_name: "User"
  belongs_to :spotted, class_name: "Member"
  before_validation :calculate_points
  validate :validate, on: :create
  
  has_one_attached :image
  
  def calculate_points
    points = 500
    if Spot.where(spotted_id: spotter_id, spotter_id: spotted_id).where("created_at > ?", 2.hours.ago).any?
      points += 300
    end
  end

  def validate
    if Spot.where(spotted_id:, spotter_id:).where("created_at > ?", 1.hours.ago).any?
      errors.add(:base, "You can only spot people once every hour.")
    end
  end
end

