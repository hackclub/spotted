# frozen_string_literal: true

class Member < ApplicationRecord
  belongs_to :user
  belongs_to :team
  has_many :spots, inverse_of: :spotted

  validates :user, :team, presence: true
  
  def spotted_by_in_past_hour
    spots.where("spots.created_at > ?", 1.hour.ago).pluck(:spotter_id)
  end
end
