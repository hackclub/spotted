# frozen_string_literal: true

class Spot < ApplicationRecord
  include ActionView::Helpers::DateHelper
  belongs_to :spotter, class_name: "User"
  belongs_to :spotted, class_name: "Member"
  before_validation :calculate_points, on: :create
  validate :validate, on: :create
  
  has_one_attached :image
  
  def calculate_points
    points = 500
    if Spot.where(spotted_id: spotter_id, spotter_id: spotted_id).where("spots.created_at > ?", 2.hours.ago).any?
      points += 300
    end
    points += (squirrels || 0) * 100
    self.points = points
  end

  def validate
    if Spot.where(spotted_id:, spotter_id:).where("spots.created_at > ?", 0.hours.ago).any?
      errors.add(:base, "You can only spot people once every hour.")
    end
  end
  
  def entry
    {
      picture: image.attached? ? Rails.application.routes.url_helpers.url_for(image) : "https://upload.wikimedia.org/wikipedia/commons/8/84/LA_Hacks_Wikipedia.png",
      spotter: {
        name: spotter.name || spotter.email,
        emoji: spotter.emoji
      },
      spotted: {
        name: spotted.user.name || spotted.user.email,
        emoji: spotted.user.emoji
      },
      ago: "#{distance_of_time_in_words_to_now created_at} ago",
      action: ["saw", "took a picture of", "found", "spotted"].sample
    }
  end
end

